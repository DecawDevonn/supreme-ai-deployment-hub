/**
 * Persona Schema Validator
 * Validates persona objects against the required schema
 */

export interface PersonaSchema {
  id: string;
  name: string;
  role: string;
  archetype?: string;
  identity?: Record<string, any>;
  traits?: Record<string, any>;
  skills?: Record<string, any>;
  boundaries?: Record<string, any>;
  memory_hooks?: Record<string, any>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates a persona object against the required schema
 */
export const validatePersonaSchema = (persona: any): ValidationResult => {
  const errors: string[] = [];

  // Required fields
  if (!persona.id || typeof persona.id !== 'string') {
    errors.push('Missing or invalid required field: id');
  }

  if (!persona.name || typeof persona.name !== 'string') {
    errors.push('Missing or invalid required field: name');
  }

  if (!persona.role || typeof persona.role !== 'string') {
    errors.push('Missing or invalid required field: role');
  }

  // Optional fields - validate types if present
  if (persona.archetype && typeof persona.archetype !== 'string') {
    errors.push('Invalid type for archetype: expected string');
  }

  if (persona.identity && typeof persona.identity !== 'object') {
    errors.push('Invalid type for identity: expected object');
  }

  if (persona.traits && typeof persona.traits !== 'object') {
    errors.push('Invalid type for traits: expected object');
  }

  if (persona.skills && typeof persona.skills !== 'object') {
    errors.push('Invalid type for skills: expected object');
  }

  if (persona.boundaries && typeof persona.boundaries !== 'object') {
    errors.push('Invalid type for boundaries: expected object');
  }

  if (persona.memory_hooks && typeof persona.memory_hooks !== 'object') {
    errors.push('Invalid type for memory_hooks: expected object');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
