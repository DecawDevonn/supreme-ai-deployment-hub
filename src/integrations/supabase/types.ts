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
      categories: {
        Row: {
          created_at: string
          gradient: string
          icon: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          gradient: string
          icon: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          gradient?: string
          icon?: string
          id?: string
          name?: string
          slug?: string
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
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
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
      course_lessons: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          duration: number
          id: string
          order_index: number
          title: string
          video_url: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          order_index: number
          title: string
          video_url?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          order_index?: number
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          difficulty: string | null
          id: string
          instructor_avatar: string | null
          instructor_name: string | null
          is_premium: boolean
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          instructor_avatar?: string | null
          instructor_name?: string | null
          is_premium?: boolean
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          instructor_avatar?: string | null
          instructor_name?: string | null
          is_premium?: boolean
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          course_id: string
          enrolled_at: string
          id: string
          progress: number
          user_id: string
        }
        Insert: {
          course_id: string
          enrolled_at?: string
          id?: string
          progress?: number
          user_id: string
        }
        Update: {
          course_id?: string
          enrolled_at?: string
          id?: string
          progress?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
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
      live_events: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_live: boolean
          is_premium: boolean
          scheduled_at: string
          stream_url: string | null
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_live?: boolean
          is_premium?: boolean
          scheduled_at: string
          stream_url?: string | null
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_live?: boolean
          is_premium?: boolean
          scheduled_at?: string
          stream_url?: string | null
          thumbnail_url?: string | null
          title?: string
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
      subscription_tiers: {
        Row: {
          created_at: string
          features: Json
          id: string
          name: string
          price_monthly: number
          price_yearly: number
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
        }
        Insert: {
          created_at?: string
          features?: Json
          id?: string
          name: string
          price_monthly: number
          price_yearly: number
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
        }
        Update: {
          created_at?: string
          features?: Json
          id?: string
          name?: string
          price_monthly?: number
          price_yearly?: number
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
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
      user_subscriptions: {
        Row: {
          billing_period: string
          created_at: string
          ends_at: string | null
          id: string
          started_at: string
          status: string
          stripe_subscription_id: string | null
          tier_id: string
          user_id: string
        }
        Insert: {
          billing_period: string
          created_at?: string
          ends_at?: string | null
          id?: string
          started_at?: string
          status: string
          stripe_subscription_id?: string | null
          tier_id: string
          user_id: string
        }
        Update: {
          billing_period?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          started_at?: string
          status?: string
          stripe_subscription_id?: string | null
          tier_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          difficulty: string | null
          duration: number
          id: string
          instructor_avatar: string | null
          instructor_name: string | null
          is_premium: boolean
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
          view_count: number
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          duration?: number
          id?: string
          instructor_avatar?: string | null
          instructor_name?: string | null
          is_premium?: boolean
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
          view_count?: number
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          duration?: number
          id?: string
          instructor_avatar?: string | null
          instructor_name?: string | null
          is_premium?: boolean
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "videos_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      watch_history: {
        Row: {
          id: string
          progress: number
          user_id: string
          video_id: string
          watched_at: string
        }
        Insert: {
          id?: string
          progress?: number
          user_id: string
          video_id: string
          watched_at?: string
        }
        Update: {
          id?: string
          progress?: number
          user_id?: string
          video_id?: string
          watched_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "watch_history_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
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
      [_ in never]: never
    }
    Functions: {
      claim_first_admin: { Args: { _user_id: string }; Returns: boolean }
      decrypt_credentials: {
        Args: { encrypted_data: string; encryption_key: string }
        Returns: Json
      }
      encrypt_credentials: {
        Args: { credentials_json: Json; encryption_key: string }
        Returns: string
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
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
