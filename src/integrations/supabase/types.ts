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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          details: Json | null
          entity: string
          entity_id: string | null
          id: string
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          entity: string
          entity_id?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          entity?: string
          entity_id?: string | null
          id?: string
        }
        Relationships: []
      }
      candidate_notes: {
        Row: {
          author_email: string | null
          author_id: string
          body: string
          candidate_id: string
          created_at: string
          id: string
          kind: string
        }
        Insert: {
          author_email?: string | null
          author_id?: string
          body: string
          candidate_id: string
          created_at?: string
          id?: string
          kind?: string
        }
        Update: {
          author_email?: string | null
          author_id?: string
          body?: string
          candidate_id?: string
          created_at?: string
          id?: string
          kind?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_notes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "cv_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      cv_submissions: {
        Row: {
          applied_job: string | null
          assigned_to: string | null
          country_preference: string
          created_at: string
          cv_filename: string | null
          cv_path: string | null
          email: string | null
          flag_note: string | null
          flagged: boolean
          full_name: string
          id: string
          message: string | null
          next_follow_up: string | null
          phone: string
          sector: string
          status: string
        }
        Insert: {
          applied_job?: string | null
          assigned_to?: string | null
          country_preference?: string
          created_at?: string
          cv_filename?: string | null
          cv_path?: string | null
          email?: string | null
          flag_note?: string | null
          flagged?: boolean
          full_name: string
          id?: string
          message?: string | null
          next_follow_up?: string | null
          phone: string
          sector: string
          status?: string
        }
        Update: {
          applied_job?: string | null
          assigned_to?: string | null
          country_preference?: string
          created_at?: string
          cv_filename?: string | null
          cv_path?: string | null
          email?: string | null
          flag_note?: string | null
          flagged?: boolean
          full_name?: string
          id?: string
          message?: string | null
          next_follow_up?: string | null
          phone?: string
          sector?: string
          status?: string
        }
        Relationships: []
      }
      employer_messages: {
        Row: {
          body: string
          company: string
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          replied_at: string | null
          replied_by: string | null
          reply: string | null
          status: string
          subject: string
        }
        Insert: {
          body: string
          company: string
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          replied_at?: string | null
          replied_by?: string | null
          reply?: string | null
          status?: string
          subject: string
        }
        Update: {
          body?: string
          company?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          replied_at?: string | null
          replied_by?: string | null
          reply?: string | null
          status?: string
          subject?: string
        }
        Relationships: []
      }
      job_post_candidates: {
        Row: {
          candidate_id: string
          created_at: string
          job_id: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          job_id: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          job_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_post_candidates_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "cv_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_post_candidates_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      job_posts: {
        Row: {
          benefits: string[]
          city: string
          company_details: string | null
          company_name: string | null
          contract: string | null
          country: string
          created_at: string
          created_by: string | null
          description: string | null
          housing: string | null
          id: string
          image_url: string | null
          language: string | null
          openings: number
          published: boolean
          requirements: string[]
          salary: string
          schedule: string | null
          sector: string
          slug: string | null
          start_date: string | null
          status: string
          tasks: string[]
          title: string
          transport: string | null
        }
        Insert: {
          benefits?: string[]
          city: string
          company_details?: string | null
          company_name?: string | null
          contract?: string | null
          country: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          housing?: string | null
          id?: string
          image_url?: string | null
          language?: string | null
          openings?: number
          published?: boolean
          requirements?: string[]
          salary: string
          schedule?: string | null
          sector: string
          slug?: string | null
          start_date?: string | null
          status?: string
          tasks?: string[]
          title: string
          transport?: string | null
        }
        Update: {
          benefits?: string[]
          city?: string
          company_details?: string | null
          company_name?: string | null
          contract?: string | null
          country?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          housing?: string | null
          id?: string
          image_url?: string | null
          language?: string | null
          openings?: number
          published?: boolean
          requirements?: string[]
          salary?: string
          schedule?: string | null
          sector?: string
          slug?: string | null
          start_date?: string | null
          status?: string
          tasks?: string[]
          title?: string
          transport?: string | null
        }
        Relationships: []
      }
      staff_notifications: {
        Row: {
          actor_email: string | null
          actor_id: string | null
          body: string | null
          created_at: string
          emailed: boolean
          entity: string | null
          entity_id: string | null
          id: string
          kind: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          actor_email?: string | null
          actor_id?: string | null
          body?: string | null
          created_at?: string
          emailed?: boolean
          entity?: string | null
          entity_id?: string | null
          id?: string
          kind?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          actor_email?: string | null
          actor_id?: string | null
          body?: string | null
          created_at?: string
          emailed?: boolean
          entity?: string | null
          entity_id?: string | null
          id?: string
          kind?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      staff_profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          manager_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          manager_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          manager_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vacancy_enquiries: {
        Row: {
          assigned_to: string | null
          company: string
          contact_name: string
          country: string
          created_at: string
          email: string
          id: string
          message: string
          phone: string | null
          status: string
        }
        Insert: {
          assigned_to?: string | null
          company: string
          contact_name: string
          country: string
          created_at?: string
          email: string
          id?: string
          message: string
          phone?: string | null
          status?: string
        }
        Update: {
          assigned_to?: string | null
          company?: string
          contact_name?: string
          country?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          phone?: string | null
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit_candidate: {
        Args: { _candidate: string; _user_id: string }
        Returns: boolean
      }
      can_edit_lead: {
        Args: { _assignee: string; _user_id: string }
        Returns: boolean
      }
      can_view_candidate: {
        Args: { _candidate: string; _user_id: string }
        Returns: boolean
      }
      claim_lead: { Args: { _id: string; _table: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_internal: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      role_of: { Args: { _user_id: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "recruiter" | "cofounder" | "manager" | "agency"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "recruiter", "cofounder", "manager", "agency"],
    },
  },
} as const
