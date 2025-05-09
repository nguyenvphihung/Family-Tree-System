-- Đảm bảo các bảng tạo trong schema public
SET search_path TO public;

-- Tạo các kiểu ENUM
CREATE TYPE gender_type AS ENUM ('Nam', 'Nữ', 'Khác');
CREATE TYPE relationship_type AS ENUM ('parent', 'child', 'spouse', 'sibling');
CREATE TYPE relationship_status AS ENUM ('active', 'inactive');

-- Tạo bảng persons
CREATE TABLE public.persons (
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

CREATE INDEX idx_persons_name ON public.persons(full_name);
CREATE INDEX idx_persons_cccd ON public.persons(cccd_number);
CREATE INDEX idx_persons_birth_date ON public.persons(birth_date);

-- Tạo bảng relationships
CREATE TABLE public.relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
    related_person_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
    relationship_type relationship_type NOT NULL,
    start_date DATE,
    end_date DATE,
    status relationship_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_relationship UNIQUE(person_id, related_person_id, relationship_type)
);

CREATE INDEX idx_relationships_person ON public.relationships(person_id);
CREATE INDEX idx_relationships_related_person ON public.relationships(related_person_id);
CREATE INDEX idx_relationships_type ON public.relationships(relationship_type);

-- Tạo bảng family_groups
CREATE TABLE public.family_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES public.persons(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng family_group_members
CREATE TABLE public.family_group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_group_id UUID NOT NULL REFERENCES public.family_groups(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
    role VARCHAR(50),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_member UNIQUE(family_group_id, person_id)
);

-- Tạo bảng audit_logs
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,
    changed_by UUID REFERENCES public.persons(id),
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger cập nhật updated_at
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Gán trigger cho các bảng
CREATE TRIGGER update_persons_modtime
BEFORE UPDATE ON public.persons
FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_relationships_modtime
BEFORE UPDATE ON public.relationships
FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_family_groups_modtime
BEFORE UPDATE ON public.family_groups
FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_family_group_members_modtime
BEFORE UPDATE ON public.family_group_members
FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();