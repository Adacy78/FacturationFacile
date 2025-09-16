export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          siren: string;
          vat_number: string | null;
          email: string;
          phone: string | null;
          address: string;
          city: string;
          postal_code: string;
          country: string | null;
          website: string | null;
          business_type: string | null;
          legal_form: string | null;
          stripe_account_id: string | null;
          is_stripe_connected: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          siren: string;
          vat_number?: string | null;
          email: string;
          phone?: string | null;
          address: string;
          city: string;
          postal_code: string;
          country?: string | null;
          website?: string | null;
          business_type?: string | null;
          legal_form?: string | null;
          stripe_account_id?: string | null;
          is_stripe_connected?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          siren?: string;
          vat_number?: string | null;
          email?: string;
          phone?: string | null;
          address?: string;
          city?: string;
          postal_code?: string;
          country?: string | null;
          website?: string | null;
          business_type?: string | null;
          legal_form?: string | null;
          stripe_account_id?: string | null;
          is_stripe_connected?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      clients: {
        Row: {
          id: string;
          company_id: string | null;
          name: string;
          siren: string;
          vat_number: string | null;
          email: string;
          phone: string | null;
          billing_address: string;
          delivery_address: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          company_id?: string | null;
          name: string;
          siren: string;
          vat_number?: string | null;
          email: string;
          phone?: string | null;
          billing_address: string;
          delivery_address?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          company_id?: string | null;
          name?: string;
          siren?: string;
          vat_number?: string | null;
          email?: string;
          phone?: string | null;
          billing_address?: string;
          delivery_address?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      products: {
        Row: {
          id: string;
          company_id: string | null;
          name: string;
          description: string | null;
          category: string | null;
          price_ht: number;
          vat_rate: number | null;
          unit: string | null;
          usage_count: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          company_id?: string | null;
          name: string;
          description?: string | null;
          category?: string | null;
          price_ht: number;
          vat_rate?: number | null;
          unit?: string | null;
          usage_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          company_id?: string | null;
          name?: string;
          description?: string | null;
          category?: string | null;
          price_ht?: number;
          vat_rate?: number | null;
          unit?: string | null;
          usage_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      invoices: {
        Row: {
          id: string;
          company_id: string | null;
          client_id: string | null;
          number: string;
          type: string | null;
          status: string | null;
          issue_date: string | null;
          due_date: string | null;
          total_ht: number | null;
          total_vat: number | null;
          total_ttc: number | null;
          payment_method: string | null;
          payment_date: string | null;
          stripe_payment_intent_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          company_id?: string | null;
          client_id?: string | null;
          number: string;
          type?: string | null;
          status?: string | null;
          issue_date?: string | null;
          due_date?: string | null;
          total_ht?: number | null;
          total_vat?: number | null;
          total_ttc?: number | null;
          payment_method?: string | null;
          payment_date?: string | null;
          stripe_payment_intent_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          company_id?: string | null;
          client_id?: string | null;
          number?: string;
          type?: string | null;
          status?: string | null;
          issue_date?: string | null;
          due_date?: string | null;
          total_ht?: number | null;
          total_vat?: number | null;
          total_ttc?: number | null;
          payment_method?: string | null;
          payment_date?: string | null;
          stripe_payment_intent_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      invoice_lines: {
        Row: {
          id: string;
          invoice_id: string | null;
          product_id: string | null;
          description: string;
          quantity: number;
          unit_price_ht: number;
          vat_rate: number;
          total_ht: number;
          total_vat: number;
          total_ttc: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          invoice_id?: string | null;
          product_id?: string | null;
          description: string;
          quantity: number;
          unit_price_ht: number;
          vat_rate: number;
          total_ht: number;
          total_vat: number;
          total_ttc: number;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          invoice_id?: string | null;
          product_id?: string | null;
          description?: string;
          quantity?: number;
          unit_price_ht?: number;
          vat_rate?: number;
          total_ht?: number;
          total_vat?: number;
          total_ttc?: number;
          created_at?: string | null;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
    users: {
      Row: {
        id: string;
        email: string;
        created_at: string | null;
        updated_at: string | null;
      };
      Insert: {
        id: string;
        email: string;
        created_at?: string | null;
        updated_at?: string | null;
      };
      Update: {
        id?: string;
        email?: string;
        created_at?: string | null;
        updated_at?: string | null;
      };
    };
  };
}