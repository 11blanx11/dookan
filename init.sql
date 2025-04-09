-- Create the identifier events table 
CREATE TABLE IF NOT EXISTS identifier_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('CREATE', 'UPDATE', 'DELETE')),
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- Create the user_sessions table to monitor active sessions
CREATE TABLE IF NOT EXISTS user_sessions(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    session_token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
)

CREATE TABLE IF NOT EXISTS user_event_logs(
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id VARCHAR(255) NOT NULL,
	product_id VARCHAR(255) NOT NULL,
	event_status VARCHAR(20) NOT NULL, 
	event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Trigger Setup
-- automatically log the timestamp for when event is triggered
CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        NEW.event_timestamp = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_events_timestamp ON identifier_events;
    CREATE TRIGGER update_events_timestamp
    BEFORE UPDATE ON identifier_events
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Setting up automatic deletion of stale tokens whenever new token created
CREATE OR REPLACE FUNCTION delete_expired_sessions()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS cleanup_expired_sessions ON user_sessions;
CREATE TRIGGER cleanup_expired_sessions
BEFORE INSERT ON user_sessions
FOR EACH STATEMENT
EXECUTE FUNCTION delete_expired_sessions();