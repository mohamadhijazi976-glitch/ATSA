/*
  # Create products table and authentication setup

  1. New Tables
    - `products`
      - `id` (uuid, primary key) - Unique identifier for each product
      - `title` (text) - Product title
      - `description` (text) - Product description
      - `image_url` (text) - URL to product image
      - `slug` (text, unique) - URL-friendly identifier
      - `order_index` (integer) - Display order
      - `is_active` (boolean, default true) - Whether product is visible
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `created_by` (uuid) - Reference to user who created the product

  2. Security
    - Enable RLS on `products` table
    - Add policy for public to read active products
    - Add policy for authenticated users to manage products
    - Add policy for authenticated users to insert products
    - Add policy for authenticated users to update products
    - Add policy for authenticated users to delete products

  3. Important Notes
    - Products can be viewed by anyone when is_active is true
    - Only authenticated users can create, update, or delete products
    - Slug must be unique for URL routing
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  slug text UNIQUE NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON products
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS products_slug_idx ON products(slug);
CREATE INDEX IF NOT EXISTS products_order_index_idx ON products(order_index);
CREATE INDEX IF NOT EXISTS products_is_active_idx ON products(is_active);