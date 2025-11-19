const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, './package.json');

describe('package.json tests', () => {
  let packageJson;

  beforeAll(() => {
    const fileContent = fs.readFileSync(packageJsonPath, 'utf8');
    packageJson = JSON.parse(fileContent);
  });

  // Test for core fields
  test('should have a "name" field of type string', () => {
    expect(packageJson).toHaveProperty('name');
    expect(typeof packageJson.name).toBe('string');
    expect(packageJson.name).not.toBe('');
  });

  test('should have a "version" field of type string', () => {
    expect(packageJson).toHaveProperty('version');
    expect(typeof packageJson.version).toBe('string');
    // Regex to check for common version formats like X.Y.Z
    expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+(?:-[\da-zA-Z.-]+)?(?:\+[\da-zA-Z.-]+)?$/);
  });

  test('should have a "private" field of type boolean', () => {
    expect(packageJson).toHaveProperty('private');
    expect(typeof packageJson.private).toBe('boolean');
  });

  // Test for common scripts
  test('should have a "scripts" object', () => {
    expect(packageJson).toHaveProperty('scripts');
    expect(typeof packageJson.scripts).toBe('object');
    expect(packageJson.scripts).not.toBeNull();
  });

  test('should include "dev" script', () => {
    expect(packageJson.scripts).toHaveProperty('dev');
    expect(typeof packageJson.scripts.dev).toBe('string');
  });

  test('should include "build" script', () => {
    expect(packageJson.scripts).toHaveProperty('build');
    expect(typeof packageJson.scripts.build).toBe('string');
  });

  test('should include "start" script', () => {
    expect(packageJson.scripts).toHaveProperty('start');
    expect(typeof packageJson.scripts.start).toBe('string');
  });

  // Test for key dependencies
  test('should have a "dependencies" object', () => {
    expect(packageJson).toHaveProperty('dependencies');
    expect(typeof packageJson.dependencies).toBe('object');
    expect(packageJson.dependencies).not.toBeNull();
  });

  test('should list "next" in dependencies', () => {
    expect(packageJson.dependencies).toHaveProperty('next');
    expect(typeof packageJson.dependencies.next).toBe('string');
  });

  test('should list "react" in dependencies', () => {
    expect(packageJson.dependencies).toHaveProperty('react');
    expect(typeof packageJson.dependencies.react).toBe('string');
  });

  test('should list "firebase" in dependencies', () => {
    expect(packageJson.dependencies).toHaveProperty('firebase');
    expect(typeof packageJson.dependencies.firebase).toBe('string');
  });
});