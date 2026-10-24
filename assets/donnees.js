/* Connexion à la base de la Casual Map et des Vendeurs fiables (Supabase).
   Cette clé est publique par nature : la sécurité vient des règles de la base (seuls les admins connectés écrivent). */
window.CD = {
  url: 'https://emiveacfwbhhpcdghanv.supabase.co',
  cle: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtaXZlYWNmd2JoaHBjZGdoYW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MjQ1NTgsImV4cCI6MjA5MjEwMDU1OH0.zZ6eWTPVXMhUp1VQbpUI-J5L_t0osI9ipLTSoLeQQRY',
  _client: null,
  supabase() { return this._client || (this._client = window.supabase.createClient(this.url, this.cle, { auth: { persistSession: true, storageKey: 'cd-admin' } })); },
};
