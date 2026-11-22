
import { supabase } from '../../lib/supabase.js';

export default function GetImageUrl(path: string) {
    const { data } = supabase.storage
        .from('content-img')
        .getPublicUrl(path);

    return data.publicUrl;
}
