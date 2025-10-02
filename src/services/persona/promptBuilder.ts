/**
 * Prompt Builder
 * Converts persona schema into system prompts for AI agents
 */

import { PersonaSchema } from './personaSchemaValidator';

/**
 * Builds a system prompt from a persona schema
 */
export const buildPersonaPrompt = (persona: PersonaSchema): string => {
  const sections: string[] = [];

  // Header
  sections.push(`You are ${persona.name}, a ${persona.role}.`);
  
  if (persona.archetype) {
    sections.push(`Your archetype is: ${persona.archetype}`);
  }

  // Identity
  if (persona.identity && Object.keys(persona.identity).length > 0) {
    sections.push('\n### Identity');
    for (const [key, value] of Object.entries(persona.identity)) {
      sections.push(`${key}: ${JSON.stringify(value)}`);
    }
  }

  // Traits
  if (persona.traits && Object.keys(persona.traits).length > 0) {
    sections.push('\n### Traits');
    for (const [key, value] of Object.entries(persona.traits)) {
      sections.push(`${key}: ${JSON.stringify(value)}`);
    }
  }

  // Skills
  if (persona.skills && Object.keys(persona.skills).length > 0) {
    sections.push('\n### Skills');
    for (const [key, value] of Object.entries(persona.skills)) {
      sections.push(`${key}: ${JSON.stringify(value)}`);
    }
  }

  // Boundaries
  if (persona.boundaries && Object.keys(persona.boundaries).length > 0) {
    sections.push('\n### Boundaries');
    for (const [key, value] of Object.entries(persona.boundaries)) {
      sections.push(`${key}: ${JSON.stringify(value)}`);
    }
  }

  // Memory Hooks
  if (persona.memory_hooks && Object.keys(persona.memory_hooks).length > 0) {
    sections.push('\n### Memory Hooks');
    for (const [key, value] of Object.entries(persona.memory_hooks)) {
      sections.push(`${key}: ${JSON.stringify(value)}`);
    }
  }

  return sections.join('\n');
};
