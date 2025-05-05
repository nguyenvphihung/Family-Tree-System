-- Tạo database
CREATE DATABASE IF NOT EXISTS familytree;

-- Sử dụng database vừa tạo
\c familytree;

-- Tạo các kiểu ENUM
CREATE TYPE gender_type AS ENUM ('Nam', 'Nữ', 'Khác');
CREATE TYPE relationship_type AS ENUM ('parent', 'child', 'spouse', 'sibling');
CREATE TYPE relationship_status AS ENUM ('active', 'inactive');

-- Tạo bảng persons
CREATE TABLE IF NOT EXISTS persons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cccd_number VARCHAR(12) UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    birth_date DATE,
    gender gender_type,
    nationality VARCHAR(50) DEFAULT 'Việt Nam',
    home_town VARCHAR(100),
    permanent_address TEXT,
    current_address TEXT,
    issue_date DATE,
    issue_place VARCHAR(100),
    expiry_date DATE,
    phone_number VARCHAR(15),
    email VARCHAR(100),
    profile_image VARCHAR(255),
    cccd_image_front VARCHAR(255),
    cccd_image_back VARCHAR(255),
    is_alive BOOLEAN DEFAULT TRUE,
    death_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo index cho các trường tìm kiếm
CREATE INDEX idx_persons_name ON persons(full_name);
CREATE INDEX idx_persons_cccd ON persons(cccd_number);
CREATE INDEX idx_persons_birth_date ON persons(birth_date);

-- Tạo bảng relationships
CREATE TABLE IF NOT EXISTS relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    related_person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    relationship_type relationship_type NOT NULL,
    start_date DATE,
    end_date DATE,
    status relationship_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_relationship UNIQUE(person_id, related_person_id, relationship_type)
);

-- Tạo index cho bảng relationships
CREATE INDEX idx_relationships_person ON relationships(person_id);
CREATE INDEX idx_relationships_related_person ON relationships(related_person_id);
CREATE INDEX idx_relationships_type ON relationships(relationship_type);

-- Tạo bảng family_groups
CREATE TABLE IF NOT EXISTS family_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES persons(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng family_group_members
CREATE TABLE IF NOT EXISTS family_group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    role VARCHAR(50),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_member UNIQUE(family_group_id, person_id)
);

-- Tạo bảng để lưu lịch sử thay đổi
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,
    changed_by UUID REFERENCES persons(id),
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo trigger function để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tạo trigger cho các bảng
CREATE TRIGGER update_persons_modtime
BEFORE UPDATE ON persons
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_relationships_modtime
BEFORE UPDATE ON relationships
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_family_groups_modtime
BEFORE UPDATE ON family_groups
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_family_group_members_modtime
BEFORE UPDATE ON family_group_members
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Thêm dữ liệu mẫu (optional)
INSERT INTO persons (full_name, birth_date, gender, nationality, cccd_number)
VALUES 
('Nguyễn Văn A', '1980-01-01', 'Nam', 'Việt Nam', '001080000001'),
('Trần Thị B', '1985-05-15', 'Nữ', 'Việt Nam', '001085000002'),
('Nguyễn Văn C', '2005-10-20', 'Nam', 'Việt Nam', '001005000003');

-- Thêm mối quan hệ mẫu
INSERT INTO relationships (person_id, related_person_id, relationship_type, start_date)
SELECT 
    (SELECT id FROM persons WHERE full_name = 'Nguyễn Văn A'),
    (SELECT id FROM persons WHERE full_name = 'Nguyễn Văn C'),
    'parent',
    '2005-10-20'
WHERE EXISTS (SELECT 1 FROM persons WHERE full_name = 'Nguyễn Văn A')
  AND EXISTS (SELECT 1 FROM persons WHERE full_name = 'Nguyễn Văn C');

INSERT INTO relationships (person_id, related_person_id, relationship_type, start_date)
SELECT 
    (SELECT id FROM persons WHERE full_name = 'Nguyễn Văn C'),
    (SELECT id FROM persons WHERE full_name = 'Nguyễn Văn A'),
    'child',
    '2005-10-20'
WHERE EXISTS (SELECT 1 FROM persons WHERE full_name = 'Nguyễn Văn A')
  AND EXISTS (SELECT 1 FROM persons WHERE full_name = 'Nguyễn Văn C');

INSERT INTO relationships (person_id, related_person_id, relationship_type, start_date)
SELECT 
    (SELECT id FROM persons WHERE full_name = 'Nguyễn Văn A'),
    (SELECT id FROM persons WHERE full_name = 'Trần Thị B'),
    'spouse',
    '2000-12-15'
WHERE EXISTS (SELECT 1 FROM persons WHERE full_name = 'Nguyễn Văn A')
  AND EXISTS (SELECT 1 FROM persons WHERE full_name = 'Trần Thị B');

INSERT INTO relationships (person_id, related_person_id, relationship_type, start_date)
SELECT 
    (SELECT id FROM persons WHERE full_name = 'Trần Thị B'),
    (SELECT id FROM persons WHERE full_name = 'Nguyễn Văn A'),
    'spouse',
    '2000-12-15'
WHERE EXISTS (SELECT 1 FROM persons WHERE full_name = 'Nguyễn Văn A')
  AND EXISTS (SELECT 1 FROM persons WHERE full_name = 'Trần Thị B');

-- Tạo view để hiển thị cây gia đình
CREATE OR REPLACE VIEW family_view AS
SELECT 
    p.id,
    p.full_name,
    p.birth_date,
    p.gender,
    p.is_alive,
    ARRAY_AGG(DISTINCT jsonb_build_object(
        'id', r.related_person_id,
        'name', rp.full_name,
        'relationship', r.relationship_type
    )) FILTER (WHERE r.id IS NOT NULL) AS relationships
FROM 
    persons p
LEFT JOIN relationships r ON p.id = r.person_id
LEFT JOIN persons rp ON r.related_person_id = rp.id
GROUP BY p.id, p.full_name, p.birth_date, p.gender, p.is_alive;

-- Tạo function để tìm tất cả người thân (đệ quy)
CREATE OR REPLACE FUNCTION get_family_members(start_person_id UUID, max_depth INT DEFAULT 10)
RETURNS TABLE (
    person_id UUID,
    related_person_id UUID,
    relationship_type relationship_type,
    depth INT
) AS $$
WITH RECURSIVE family_tree AS (
    -- Base case
    SELECT 
        r.person_id,
        r.related_person_id,
        r.relationship_type,
        1 AS depth
    FROM relationships r
    WHERE r.person_id = start_person_id
    
    UNION
    
    -- Recursive case
    SELECT 
        r.person_id,
        r.related_person_id,
        r.relationship_type,
        ft.depth + 1
    FROM relationships r
    JOIN family_tree ft ON r.person_id = ft.related_person_id
    WHERE ft.depth < max_depth
)
SELECT * FROM family_tree;
$$ LANGUAGE SQL;

-- Tạo function để xác thực quan hệ 
CREATE OR REPLACE FUNCTION validate_relationship()
RETURNS TRIGGER AS $$
BEGIN
    -- Kiểm tra không thể tạo quan hệ với chính mình
    IF NEW.person_id = NEW.related_person_id THEN
        RAISE EXCEPTION 'Không thể tạo quan hệ với chính mình';
    END IF;
    
    -- Nếu là quan hệ parent-child, thêm quan hệ ngược lại
    IF NEW.relationship_type = 'parent' THEN
        -- Kiểm tra xem quan hệ ngược đã tồn tại chưa
        IF NOT EXISTS (
            SELECT 1 FROM relationships 
            WHERE person_id = NEW.related_person_id 
            AND related_person_id = NEW.person_id 
            AND relationship_type = 'child'
        ) THEN
            INSERT INTO relationships (person_id, related_person_id, relationship_type, start_date, status)
            VALUES (NEW.related_person_id, NEW.person_id, 'child', NEW.start_date, NEW.status);
        END IF;
    END IF;
    
    -- Nếu là quan hệ child-parent, thêm quan hệ ngược lại
    IF NEW.relationship_type = 'child' THEN
        -- Kiểm tra xem quan hệ ngược đã tồn tại chưa
        IF NOT EXISTS (
            SELECT 1 FROM relationships 
            WHERE person_id = NEW.related_person_id 
            AND related_person_id = NEW.person_id 
            AND relationship_type = 'parent'
        ) THEN
            INSERT INTO relationships (person_id, related_person_id, relationship_type, start_date, status)
            VALUES (NEW.related_person_id, NEW.person_id, 'parent', NEW.start_date, NEW.status);
        END IF;
    END IF;
    
    -- Nếu là quan hệ spouse, thêm quan hệ ngược lại
    IF NEW.relationship_type = 'spouse' THEN
        -- Kiểm tra xem quan hệ ngược đã tồn tại chưa
        IF NOT EXISTS (
            SELECT 1 FROM relationships 
            WHERE person_id = NEW.related_person_id 
            AND related_person_id = NEW.person_id 
            AND relationship_type = 'spouse'
        ) THEN
            INSERT INTO relationships (person_id, related_person_id, relationship_type, start_date, end_date, status)
            VALUES (NEW.related_person_id, NEW.person_id, 'spouse', NEW.start_date, NEW.end_date, NEW.status);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Gắn trigger vào bảng relationships
CREATE TRIGGER relationship_validation
AFTER INSERT ON relationships
FOR EACH ROW
EXECUTE FUNCTION validate_relationship();
