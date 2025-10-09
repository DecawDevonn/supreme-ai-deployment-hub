export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      api_connections: {
        Row: {
          auth_type: Database["public"]["Enums"]["auth_type"]
          created_at: string
          credentials: string
          id: string
          is_valid: boolean
          last_validated_at: string | null
          service_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auth_type: Database["public"]["Enums"]["auth_type"]
          created_at?: string
          credentials: string
          id?: string
          is_valid?: boolean
          last_validated_at?: string | null
          service_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auth_type?: Database["public"]["Enums"]["auth_type"]
          created_at?: string
          credentials?: string
          id?: string
          is_valid?: boolean
          last_validated_at?: string | null
          service_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      knowledge_graph_entities: {
        Row: {
          conversation_id: string
          created_at: string
          entity_name: string
          entity_type: string
          id: string
          properties: Json | null
        }
        Insert: {
          conversation_id: string
          created_at?: string
          entity_name: string
          entity_type: string
          id?: string
          properties?: Json | null
        }
        Update: {
          conversation_id?: string
          created_at?: string
          entity_name?: string
          entity_type?: string
          id?: string
          properties?: Json | null
        }
        Relationships: []
      }
      knowledge_graph_relationships: {
        Row: {
          conversation_id: string
          created_at: string
          from_entity: string
          id: string
          properties: Json | null
          relationship_type: string
          to_entity: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          from_entity: string
          id?: string
          properties?: Json | null
          relationship_type: string
          to_entity: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          from_entity?: string
          id?: string
          properties?: Json | null
          relationship_type?: string
          to_entity?: string
        }
        Relationships: []
      }
      legacy_workflows: {
        Row: {
          category: string | null
          created_at: string | null
          name: string
          notes: string | null
          path: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
          workflow_id: number
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          name: string
          notes?: string | null
          path?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
          workflow_id?: number
        }
        Update: {
          category?: string | null
          created_at?: string | null
          name?: string
          notes?: string | null
          path?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
          workflow_id?: number
        }
        Relationships: []
      }
      persona_prompts: {
        Row: {
          created_at: string
          id: string
          persona_id: string
          system_prompt: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          persona_id: string
          system_prompt: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          persona_id?: string
          system_prompt?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "persona_prompts_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: true
            referencedRelation: "personas"
            referencedColumns: ["persona_id"]
          },
        ]
      }
      personas: {
        Row: {
          archetype: string | null
          boundaries: Json | null
          created_at: string
          id: string
          identity: Json | null
          is_public: boolean
          memory_hooks: Json | null
          name: string
          persona_id: string
          raw_schema: Json
          role: string
          skills: Json | null
          traits: Json | null
          updated_at: string
        }
        Insert: {
          archetype?: string | null
          boundaries?: Json | null
          created_at?: string
          id?: string
          identity?: Json | null
          is_public?: boolean
          memory_hooks?: Json | null
          name: string
          persona_id: string
          raw_schema: Json
          role: string
          skills?: Json | null
          traits?: Json | null
          updated_at?: string
        }
        Update: {
          archetype?: string | null
          boundaries?: Json | null
          created_at?: string
          id?: string
          identity?: Json | null
          is_public?: boolean
          memory_hooks?: Json | null
          name?: string
          persona_id?: string
          raw_schema?: Json
          role?: string
          skills?: Json | null
          traits?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      user_features: {
        Row: {
          created_at: string
          enabled: boolean
          feature_name: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          feature_name: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          feature_name?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workflow_runs: {
        Row: {
          error_message: string | null
          finished_at: string | null
          id: string
          input_params: Json | null
          logs: Json
          output_data: Json | null
          started_at: string
          status: string
          workflow_id: string
        }
        Insert: {
          error_message?: string | null
          finished_at?: string | null
          id?: string
          input_params?: Json | null
          logs?: Json
          output_data?: Json | null
          started_at?: string
          status?: string
          workflow_id: string
        }
        Update: {
          error_message?: string | null
          finished_at?: string | null
          id?: string
          input_params?: Json | null
          logs?: Json
          output_data?: Json | null
          started_at?: string
          status?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_runs_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string
          definition: Json
          description: string | null
          executor: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          definition?: Json
          description?: string | null
          executor?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          definition?: Json
          description?: string | null
          executor?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      api_connections_metadata: {
        Row: {
          auth_type: Database["public"]["Enums"]["auth_type"] | null
          created_at: string | null
          id: string | null
          is_valid: boolean | null
          last_validated_at: string | null
          service_name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      decrypt_credentials: {
        Args: { encrypted_data: string; encryption_key: string }
        Returns: Json
      }
      encrypt_credentials: {
        Args: { credentials_json: Json; encryption_key: string }
        Returns: string
      }
      get_api_connections_metadata: {
        Args: Record<PropertyKey, never>
        Returns: {
          auth_type: Database["public"]["Enums"]["auth_type"]
          created_at: string
          id: string
          is_valid: boolean
          last_validated_at: string
          service_name: string
          updated_at: string
          user_id: string
        }[]
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      auth_type: "api_key" | "oauth2" | "basic_auth" | "bearer_token"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      auth_type: ["api_key", "oauth2", "basic_auth", "bearer_token"],
    },
  },
} as const
