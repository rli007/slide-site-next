-- Fix delivery status update permissions for sliders
-- This allows sliders to update the status of deliveries they're assigned to

-- Drop the existing policy that might be too restrictive
DROP POLICY IF EXISTS "Sliders can update assigned deliveries" ON public.deliveries;

-- Create a new policy that allows sliders to update delivery status
CREATE POLICY "Sliders can update delivery status" ON public.deliveries
    FOR UPDATE USING (
        status IN ('assigned', 'in-transit', 'delivered') AND 
        route_id IN (
            SELECT id FROM public.routes WHERE user_id = auth.uid()
        )
    );

-- Also ensure sliders can see deliveries they're assigned to
DROP POLICY IF EXISTS "Sliders can see pending deliveries" ON public.deliveries;

CREATE POLICY "Sliders can see and manage deliveries" ON public.deliveries
    FOR ALL USING (
        status = 'pending' OR 
        auth.uid() = shipper_id OR 
        (status IN ('assigned', 'in-transit', 'delivered') AND 
         route_id IN (
             SELECT id FROM public.routes WHERE user_id = auth.uid()
         ))
    );
