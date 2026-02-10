-- Enable Row Level Security on DISPATCHER_Tickets table
ALTER TABLE public."DISPATCHER_Tickets" ENABLE ROW LEVEL SECURITY;

-- Admin (authenticated users) have full access to all operations
CREATE POLICY "Admin full access"
ON public."DISPATCHER_Tickets"
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Public (anonymous) users can only read tickets by UUID
CREATE POLICY "Public read by UUID"
ON public."DISPATCHER_Tickets"
FOR SELECT
TO anon
USING (true);
