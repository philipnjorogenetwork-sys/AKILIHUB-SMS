-- Akili Hub Solutions SMS Database Schema

CREATE DATABASE IF NOT EXISTS akilihub_sms;
USE akilihub_sms;

-- Users and Auth
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO roles (name) VALUES ('Admin'), ('Secretary'), ('Teacher'), ('Student'), ('Parent'), ('Finance');

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Profiles
CREATE TABLE people (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender ENUM('Male', 'Female', 'Other'),
    phone VARCHAR(20),
    address TEXT,
    national_id VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Students
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    person_id INT UNIQUE,
    school_code VARCHAR(50) NOT NULL,
    admission_no VARCHAR(20) UNIQUE NOT NULL,
    grade_level VARCHAR(20),
    section VARCHAR(20),
    parent_id INT,
    status ENUM('Active', 'Graduated', 'Suspended', 'Left') DEFAULT 'Active',
    FOREIGN KEY (person_id) REFERENCES people(id),
    FOREIGN KEY (parent_id) REFERENCES people(id)
);

-- Admissions
CREATE TABLE applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_name VARCHAR(100) NOT NULL,
    grade_applied VARCHAR(20),
    status ENUM('Applied', 'In Review', 'Interview', 'Pending', 'Approved') DEFAULT 'Applied',
    progress_pct INT DEFAULT 20,
    parent_phone VARCHAR(20),
    parent_email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Academics
CREATE TABLE classrooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    grade VARCHAR(20),
    teacher_id INT,
    FOREIGN KEY (teacher_id) REFERENCES people(id)
);

CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE,
    teacher_id INT,
    is_elective BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (teacher_id) REFERENCES people(id)
);

-- Finance
CREATE TABLE fee_structures (
    id INT PRIMARY KEY AUTO_INCREMENT,
    grade VARCHAR(20),
    term VARCHAR(10),
    total_amount DECIMAL(10,2)
);

CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    amount DECIMAL(10,2),
    method ENUM('M-Pesa', 'Bank', 'Cash'),
    reference VARCHAR(50) UNIQUE,
    status ENUM('Completed', 'Pending', 'Failed'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Audit
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100),
    module VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
