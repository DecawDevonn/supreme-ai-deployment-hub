/**
 * Persona Service
 * Manages persona CRUD operations with Supabase
 */

import { supabase } from '@/integrations/supabase/client';
import { validatePersonaSchema, PersonaSchema } from './personaSchemaValidator';
import { buildPersonaPrompt } from './promptBuilder';

export interface Persona {
  id: string;
  persona_id: string;
  name: string;
  role: string;
  archetype?: string;
  identity?: Record<string, any>;
  traits?: Record<string, any>;
  skills?: Record<string, any>;
  boundaries?: Record<string, any>;
  memory_hooks?: Record<string, any>;
  raw_schema: Record<string, any>;
  created_at: string;
  updated_at: string;
}

/**
 * Fetches all personas from the database
 */
export const fetchPersonas = async (): Promise<Persona[]> => {
  const { data, error } = await supabase
    .from('personas')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching personas:', error);
    throw error;
  }

  return (data || []) as Persona[];
};

/**
 * Fetches a single persona by persona_id
 */
export const fetchPersona = async (personaId: string): Promise<Persona | null> => {
  const { data, error } = await supabase
    .from('personas')
    .select('*')
    .eq('persona_id', personaId)
    .single();

  if (error) {
    console.error('Error fetching persona:', error);
    throw error;
  }

  return data as Persona;
};

/**
 * Fetches the system prompt for a persona
 */
export const fetchPersonaPrompt = async (personaId: string): Promise<string> => {
  // Check if prompt is cached
  const { data: cachedPrompt, error: cacheError } = await supabase
    .from('persona_prompts')
    .select('system_prompt')
    .eq('persona_id', personaId)
    .maybeSingle();

  if (!cacheError && cachedPrompt) {
    return cachedPrompt.system_prompt;
  }

  // If not cached, build it from persona schema
  const persona = await fetchPersona(personaId);
  if (!persona) {
    throw new Error(`Persona ${personaId} not found`);
  }

  const personaSchema: PersonaSchema = {
    id: persona.persona_id,
    name: persona.name,
    role: persona.role,
    archetype: persona.archetype,
    identity: persona.identity,
    traits: persona.traits,
    skills: persona.skills,
    boundaries: persona.boundaries,
    memory_hooks: persona.memory_hooks,
  };

  const prompt = buildPersonaPrompt(personaSchema);

  // Cache the prompt
  await supabase
    .from('persona_prompts')
    .upsert({
      persona_id: personaId,
      system_prompt: prompt,
    });

  return prompt;
};

/**
 * Creates a new persona
 */
export const createPersona = async (personaSchema: PersonaSchema): Promise<Persona> => {
  // Validate schema
  const validation = validatePersonaSchema(personaSchema);
  if (!validation.valid) {
    throw new Error(`Invalid persona schema: ${validation.errors.join(', ')}`);
  }

  // Insert into database
  const { data, error } = await supabase
    .from('personas')
    .insert({
      persona_id: personaSchema.id,
      name: personaSchema.name,
      role: personaSchema.role,
      archetype: personaSchema.archetype,
      identity: personaSchema.identity || {},
      traits: personaSchema.traits || {},
      skills: personaSchema.skills || {},
      boundaries: personaSchema.boundaries || {},
      memory_hooks: personaSchema.memory_hooks || {},
      raw_schema: personaSchema as any,
    } as any)
    .select()
    .single();

  if (error) {
    console.error('Error creating persona:', error);
    throw error;
  }

  // Generate and cache prompt
  const prompt = buildPersonaPrompt(personaSchema);
  await supabase
    .from('persona_prompts')
    .insert({
      persona_id: personaSchema.id,
      system_prompt: prompt,
    });

  return data as Persona;
};

/**
 * Updates an existing persona
 */
export const updatePersona = async (
  personaId: string,
  updates: Partial<PersonaSchema>
): Promise<Persona> => {
  const { data, error } = await supabase
    .from('personas')
    .update({
      name: updates.name,
      role: updates.role,
      archetype: updates.archetype,
      identity: updates.identity,
      traits: updates.traits,
      skills: updates.skills,
      boundaries: updates.boundaries,
      memory_hooks: updates.memory_hooks,
      raw_schema: updates,
    })
    .eq('persona_id', personaId)
    .select()
    .single();

  if (error) {
    console.error('Error updating persona:', error);
    throw error;
  }

  // Regenerate and update prompt cache
  const persona = await fetchPersona(personaId);
  if (persona) {
    const personaSchema: PersonaSchema = {
      id: persona.persona_id,
      name: persona.name,
      role: persona.role,
      archetype: persona.archetype,
      identity: persona.identity,
      traits: persona.traits,
      skills: persona.skills,
      boundaries: persona.boundaries,
      memory_hooks: persona.memory_hooks,
    };

    const prompt = buildPersonaPrompt(personaSchema);
    await supabase
      .from('persona_prompts')
      .upsert({
        persona_id: personaId,
        system_prompt: prompt,
      });
  }

  return data as Persona;
};

/**
 * Deletes a persona
 */
export const deletePersona = async (personaId: string): Promise<void> => {
  const { error } = await supabase
    .from('personas')
    .delete()
    .eq('persona_id', personaId);

  if (error) {
    console.error('Error deleting persona:', error);
    throw error;
  }
};
