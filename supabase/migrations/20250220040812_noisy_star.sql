/*
  # Add reputation system

  1. New Tables
    - `reputation_events`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `event_type` (text) - Type of event that earned reputation
      - `points` (integer) - Points earned/lost
      - `source_id` (uuid) - ID of the content that triggered the event
      - `source_type` (text) - Type of content (post, topic, etc)
      - `created_at` (timestamptz)

  2. Changes
    - Add reputation column to profiles table
    - Add reputation_level column to profiles table

  3. Security
    - Enable RLS on reputation_events table
    - Add policies for viewing and creating reputation events
*/

-- Add reputation columns to profiles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'reputation'
  ) THEN
    ALTER TABLE profiles ADD COLUMN reputation integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'reputation_level'
  ) THEN
    ALTER TABLE profiles ADD COLUMN reputation_level text DEFAULT 'Newcomer';
  END IF;
END $$;

-- Create reputation events table
CREATE TABLE IF NOT EXISTS reputation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE,
  event_type text NOT NULL,
  points integer NOT NULL,
  source_id uuid,
  source_type text,
  created_at timestamptz DEFAULT now(),
  
  -- Add constraint to validate event types
  CONSTRAINT valid_event_type CHECK (
    event_type IN (
      'post_created',
      'post_liked',
      'topic_created',
      'answer_accepted',
      'post_reported'
    )
  ),
  
  -- Add constraint to validate source types
  CONSTRAINT valid_source_type CHECK (
    source_type IN (
      'post',
      'topic'
    )
  )
);

-- Enable RLS
ALTER TABLE reputation_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Reputation events are viewable by everyone"
  ON reputation_events FOR SELECT
  USING (true);

CREATE POLICY "Only system can create reputation events"
  ON reputation_events FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Create function to update reputation level
CREATE OR REPLACE FUNCTION update_reputation_level()
RETURNS trigger AS $$
BEGIN
  UPDATE profiles
  SET reputation_level = 
    CASE
      WHEN NEW.reputation >= 10000 THEN 'Legend'
      WHEN NEW.reputation >= 5000 THEN 'Master'
      WHEN NEW.reputation >= 2500 THEN 'Expert'
      WHEN NEW.reputation >= 1000 THEN 'Advanced'
      WHEN NEW.reputation >= 500 THEN 'Intermediate'
      WHEN NEW.reputation >= 100 THEN 'Beginner'
      ELSE 'Newcomer'
    END
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for reputation level updates
CREATE TRIGGER on_reputation_change
  AFTER UPDATE OF reputation ON profiles
  FOR EACH ROW
  WHEN (OLD.reputation IS DISTINCT FROM NEW.reputation)
  EXECUTE FUNCTION update_reputation_level();

-- Create function to handle reputation events
CREATE OR REPLACE FUNCTION handle_reputation_event()
RETURNS trigger AS $$
BEGIN
  UPDATE profiles
  SET reputation = reputation + NEW.points
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for reputation events
CREATE TRIGGER on_reputation_event
  AFTER INSERT ON reputation_events
  FOR EACH ROW
  EXECUTE FUNCTION handle_reputation_event();