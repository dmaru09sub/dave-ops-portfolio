
# Database Organization Strategy

## Overview
This Dave Ops portfolio app shares a Supabase database with other Lovable projects while maintaining proper data isolation.

## Table Organization

### Shared Tables (No Prefix)
- `profiles` - User profiles shared across all applications
- Authentication handled by Supabase Auth schema

### Dave Ops Portfolio Tables (daveops_ prefix)
Future tables for this app will use the `daveops_` prefix:
- `daveops_projects` - Portfolio projects
- `daveops_blog_posts` - Blog articles
- `daveops_tutorials` - Tutorial content
- `daveops_skills` - Technical skills
- `daveops_experience` - Work experience

### Other App Tables (Keep Existing)
- `trips`, `checklists`, `checklist_*`, `template_*` - Trip planning app tables

## Data Isolation Strategy

1. **Table Prefixes**: All new Dave Ops tables use `daveops_` prefix
2. **RLS Policies**: Row-level security ensures users only see their own data
3. **Application Context**: HTTP headers identify which app is making requests
4. **Utility Functions**: Helper functions ensure correct table naming and access patterns

## Best Practices

1. Always use the `daveopsTable()` helper for new table names
2. Implement RLS policies on all new tables
3. Use the `daveopsDb` utility for database operations
4. Keep authentication logic in the shared AuthProvider
5. Document any new tables added to this system

## Current Status
- ✅ Authentication context set up
- ✅ Table naming conventions established
- ✅ Database utilities created
- ⏳ Portfolio-specific tables (to be created as needed)
