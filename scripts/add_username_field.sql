-- Verificar si la columna username ya existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'username'
  ) THEN
    -- Agregar la columna username si no existe
    ALTER TABLE users ADD COLUMN username TEXT;
    
    -- Actualizar los usuarios existentes para tener un username basado en su email
    UPDATE users 
    SET username = SPLIT_PART(email, '@', 1) 
    WHERE username IS NULL;
    
    -- Hacer la columna username NOT NULL
    ALTER TABLE users ALTER COLUMN username SET NOT NULL;
    
    -- Agregar un índice único para username
    CREATE UNIQUE INDEX idx_users_username ON users(username);
  END IF;
END $$;

