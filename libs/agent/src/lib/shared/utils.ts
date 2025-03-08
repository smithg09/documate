import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { initChatModel } from 'langchain/chat_models/universal';
// import { Ollama } from "@langchain/ollama";

const SUPPORTED_PROVIDERS = [
  'openai',
  'anthropic',
  'azure_openai',
  'cohere',
  'google-vertexai',
  'google-vertexai-web',
  'google-genai',
  'ollama',
  'together',
  'fireworks',
  'mistralai',
  'groq',
  'bedrock',
  'cerebras',
  'deepseek',
  'xai',
] as const;
/**
 * Load a chat model from a fully specified name.
 * @param fullySpecifiedName - String in the format 'provider/model' or 'provider/account/provider/model'.
 * @returns A Promise that resolves to a BaseChatModel instance.
 */
export async function loadChatModel(
  fullySpecifiedName: string,
  temperature = 0.2,
): Promise<BaseChatModel> {
  const index = fullySpecifiedName.indexOf('/');
  if (index === -1) {
    // If there's no "/", assume it's just the model
    if (
      !SUPPORTED_PROVIDERS.includes(
        fullySpecifiedName as (typeof SUPPORTED_PROVIDERS)[number],
      )
    ) {
      throw new Error(`Unsupported model: ${fullySpecifiedName}`);
    }
    return await initChatModel(fullySpecifiedName, {
      temperature: temperature,
    });
  } else {
    const provider = fullySpecifiedName.slice(0, index);
    // const model = fullySpecifiedName.slice(index + 1);
    if (
      !SUPPORTED_PROVIDERS.includes(
        provider as (typeof SUPPORTED_PROVIDERS)[number],
      )
    ) {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    return await initChatModel('deepseek-r1:1.5b', {
      modelProvider: 'ollama',
      max_tokens: 1000,
      base_url: 'http://localhost:11434',
      temperature: temperature,
    });
  }
}
