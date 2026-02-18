import {
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { GenerateProposalDto } from './dto/generate-proposal.dto';

type AiProvider = 'ollama' | 'groq';

interface OllamaGenerateResponse {
  response: string;
  done: boolean;
  model?: string;
}

interface GroqChatResponse {
  choices: { message: { content: string } }[];
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly provider: AiProvider;
  private readonly httpClient: AxiosInstance;
  private readonly model: string;

  constructor(private configService: ConfigService) {
    this.provider = (this.configService.get<string>('AI_PROVIDER', 'ollama') as AiProvider);

    if (this.provider === 'groq') {
      const apiKey = this.configService.get<string>('GROQ_API_KEY');
      if (!apiKey) {
        throw new Error('GROQ_API_KEY is required when AI_PROVIDER=groq');
      }
      this.httpClient = axios.create({
        baseURL: 'https://api.groq.com/openai/v1',
        timeout: 60000,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      });
      this.model = this.configService.get<string>('GROQ_MODEL', 'llama-3.3-70b-versatile');
    } else {
      const baseURL = this.configService.get<string>('OLLAMA_BASE_URL', 'http://localhost:11434');
      const timeout = this.configService.get<number>('OLLAMA_TIMEOUT', 180000);
      this.httpClient = axios.create({
        baseURL,
        timeout,
        headers: { 'Content-Type': 'application/json' },
      });
      this.model = this.configService.get<string>('OLLAMA_MODEL', 'llama3.2:3b');
    }

    this.logger.log(`AI provider: ${this.provider} | model: ${this.model}`);
  }

  async generateProposal(dto: GenerateProposalDto): Promise<string> {
    const systemPrompt = `Eres un experto redactor de propuestas comerciales freelance. Creas propuestas profesionales, persuasivas y bien estructuradas que ganan clientes. Tus propuestas son detalladas, específicas al proyecto y destacan claramente la propuesta de valor.

Responde ÚNICAMENTE en el idioma indicado por el usuario. Usa el nombre del cliente. Referencia detalles concretos del proyecto. El desglose de presupuesto debe ser realista.`;

    const formatInstructions = `
Formato obligatorio en Markdown con estas secciones exactas:
## Resumen Ejecutivo
## Problema Identificado
## Solución Propuesta
## Arquitectura Técnica
## Fases y Entregables
## Tiempo y Cronograma
## Inversión (desglose de presupuesto)
## Por qué elegirnos
## Próximos pasos`;

    const userMessage = `
**Cliente:** ${dto.clientName}
**Descripción del proyecto:** ${dto.projectDescription}
**Alcance:** ${dto.scope}
**Presupuesto:** $${dto.budget.toLocaleString()}
**Plazo:** ${dto.timeline}
**Mis habilidades/experiencia:** ${dto.skills}
${dto.additionalNotes ? `**Notas adicionales:** ${dto.additionalNotes}` : ''}
**Tono:** ${dto.tone || 'Profesional y confiado'}
**Idioma de la propuesta:** ${dto.language || 'English'}

Genera una propuesta completa y lista para enviar, siguiendo el formato indicado.`;

    const start = Date.now();
    this.logger.log(`Generating proposal with ${this.provider}/${this.model}`);

    try {
      const content =
        this.provider === 'groq'
          ? await this.generateWithGroq(systemPrompt, formatInstructions, userMessage)
          : await this.generateWithOllama(systemPrompt, formatInstructions, userMessage);

      const duration = Date.now() - start;
      this.logger.log(`Proposal generated in ${duration}ms (${this.provider}/${this.model})`);
      return content;
    } catch (error: unknown) {
      if (
        error instanceof InternalServerErrorException ||
        error instanceof ServiceUnavailableException
      ) {
        throw error;
      }
      this.logger.error(error);
      throw new InternalServerErrorException('Error al generar la propuesta. Intenta de nuevo.');
    }
  }

  private async generateWithGroq(
    systemPrompt: string,
    formatInstructions: string,
    userMessage: string,
  ): Promise<string> {
    try {
      const { data } = await this.httpClient.post<GroqChatResponse>('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'system', content: `${systemPrompt}\n${formatInstructions}` },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.9,
      });

      const content = data?.choices?.[0]?.message?.content?.trim();
      if (!content) {
        throw new InternalServerErrorException('Groq devolvió una respuesta vacía');
      }
      return content;
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) throw error;

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) {
          throw new ServiceUnavailableException('GROQ_API_KEY inválida o expirada');
        }
        if (status === 429) {
          throw new InternalServerErrorException(
            'Límite de solicitudes excedido en Groq. Intenta en unos segundos.',
          );
        }
        const msg = error.response?.data?.error?.message || error.message;
        throw new InternalServerErrorException(msg || 'Error al comunicarse con Groq');
      }
      throw error;
    }
  }

  private async generateWithOllama(
    systemPrompt: string,
    formatInstructions: string,
    userMessage: string,
  ): Promise<string> {
    const prompt = `${systemPrompt}\n${formatInstructions}\n\nDatos del proyecto:\n${userMessage}`;

    try {
      const { data } = await this.httpClient.post<OllamaGenerateResponse>('/api/generate', {
        model: this.model,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 1536,
          stop: ['---', '\n\n\n'],
        },
      });

      const content = data?.response?.trim();
      if (!content) {
        throw new InternalServerErrorException('Ollama devolvió una respuesta vacía');
      }
      return content;
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) throw error;

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
          throw new ServiceUnavailableException(
            'Ollama no está disponible. Asegúrate de que esté corriendo en ' +
              this.configService.get('OLLAMA_BASE_URL', 'http://localhost:11434'),
          );
        }
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
          throw new InternalServerErrorException(
            'La generación tardó demasiado. Intenta de nuevo o reduce el alcance.',
          );
        }
        const msg =
          typeof error.response?.data?.error === 'string'
            ? error.response.data.error
            : error.message;
        const msgStr = typeof msg === 'string' ? msg : 'Error al generar la propuesta.';
        if (
          msgStr.toLowerCase().includes('not found') &&
          (msgStr.toLowerCase().includes('model') || msgStr.includes(this.model))
        ) {
          throw new ServiceUnavailableException(
            'El modelo de IA no está disponible. El administrador debe ejecutar: ollama pull ' +
              this.model,
          );
        }
        throw new InternalServerErrorException(msgStr || 'Error al generar la propuesta.');
      }
      throw error;
    }
  }
}
