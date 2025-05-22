export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chatbot_responses: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          intent: string
          pattern: string[] // Array of patterns
          response_en: string
          response_fr: string | null
          response_ar: string | null
          priority: number
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          intent: string
          pattern: string[] // Array of patterns
          response_en: string
          response_fr?: string | null
          response_ar?: string | null
          priority?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          intent?: string
          pattern?: string[] // Array of patterns
          response_en?: string
          response_fr?: string | null
          response_ar?: string | null
          priority?: number
          is_active?: boolean
        }
        Relationships: []
      }
      artifacts: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          period: string
          category: string
          image_url: string
          model_url: string | null
          location: string | null
          discovery_date: string | null
          additional_images: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          period: string
          category: string
          image_url: string
          model_url?: string | null
          location?: string | null
          discovery_date?: string | null
          additional_images?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          period?: string
          category?: string
          image_url?: string
          model_url?: string | null
          location?: string | null
          discovery_date?: string | null
          additional_images?: string[] | null
        }
        Relationships: []
      }
      blogs: {
        Row: {
          id: string
          created_at: string
          title: string
          author: string
          content: string
          summary: string
          image: string
          status: 'draft' | 'published'
          published_at: string | null
          tags: string[] | null
          language: string | null
          comments: {
            id: string
            text: string
            isValidated: boolean
          }[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          author: string
          content: string
          summary: string
          image: string
          status?: 'draft' | 'published'
          published_at?: string | null
          tags?: string[] | null
          language?: string | null
          comments?: {
            id: string
            text: string
            isValidated: boolean
          }[] | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          author?: string
          content?: string
          summary?: string
          image?: string
          status?: 'draft' | 'published'
          published_at?: string | null
          tags?: string[] | null
          language?: string | null
          comments?: {
            id: string
            text: string
            isValidated: boolean
          }[] | null
        }
        Relationships: []
      }
      services: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          price: number
          image_url: string
          available: boolean
          max_capacity: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          price: number
          image_url: string
          available?: boolean
          max_capacity?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          price?: number
          image_url?: string
          available?: boolean
          max_capacity?: number | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          created_at: string
          service_id: string
          customer_name: string
          customer_email: string
          customer_phone: string | null
          date: string
          status: 'pending' | 'confirmed' | 'canceled'
          notes: string | null
          participants: number
        }
        Insert: {
          id?: string
          created_at?: string
          service_id: string
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          date: string
          status?: 'pending' | 'confirmed' | 'canceled'
          notes?: string | null
          participants?: number
        }
        Update: {
          id?: string
          created_at?: string
          service_id?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          date?: string
          status?: 'pending' | 'confirmed' | 'canceled'
          notes?: string | null
          participants?: number
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            referencedRelation: "services"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string | null
          last_login: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          name?: string | null
          last_login?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string | null
          last_login?: string | null
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          content: string
          image_url: string
          additional_images: string[] | null
          category: string
          language: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          content: string
          image_url: string
          category: string
          additional_images?: string[] | null
          language?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          content?: string
          image_url?: string
          category?: string
          additional_images?: string[] | null
          language?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
