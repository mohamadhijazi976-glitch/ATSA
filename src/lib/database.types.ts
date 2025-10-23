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
      products: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string
          slug: string
          order_index: number
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url: string
          slug: string
          order_index?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string
          slug?: string
          order_index?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
    }
  }
}
