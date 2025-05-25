
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash, Plus, Eye, EyeOff } from 'lucide-react';
import type { Json } from '@/integrations/supabase/types';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty_level: string;
  estimated_duration: number;
  tags: Json;
  image_url: string;
  published: boolean;
  coming_soon: boolean;
  sort_order: number;
  created_at: string;
}

const AdminTutorials = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    difficulty_level: 'beginner',
    estimated_duration: 30,
    tags: '',
    image_url: '',
    published: true,
    coming_soon: false,
    sort_order: 0
  });

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    try {
      const { data, error } = await supabase
        .from('daveops_tutorials')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTutorials(data || []);
    } catch (error) {
      console.error('Error fetching tutorials:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tutorials',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const tutorialData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      if (editingTutorial) {
        const { error } = await supabase
          .from('daveops_tutorials')
          .update(tutorialData)
          .eq('id', editingTutorial.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Tutorial updated successfully' });
      } else {
        const { error } = await supabase
          .from('daveops_tutorials')
          .insert([tutorialData]);

        if (error) throw error;
        toast({ title: 'Success', description: 'Tutorial created successfully' });
      }

      resetForm();
      fetchTutorials();
    } catch (error) {
      console.error('Error saving tutorial:', error);
      toast({
        title: 'Error',
        description: 'Failed to save tutorial',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (tutorial: Tutorial) => {
    setEditingTutorial(tutorial);
    const tagsArray = Array.isArray(tutorial.tags) ? tutorial.tags : [];
    setFormData({
      title: tutorial.title,
      description: tutorial.description || '',
      content: tutorial.content || '',
      difficulty_level: tutorial.difficulty_level || 'beginner',
      estimated_duration: tutorial.estimated_duration || 30,
      tags: tagsArray.join(', '),
      image_url: tutorial.image_url || '',
      published: tutorial.published,
      coming_soon: tutorial.coming_soon,
      sort_order: tutorial.sort_order
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tutorial?')) return;

    try {
      const { error } = await supabase
        .from('daveops_tutorials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Success', description: 'Tutorial deleted successfully' });
      fetchTutorials();
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete tutorial',
        variant: 'destructive'
      });
    }
  };

  const togglePublished = async (tutorial: Tutorial) => {
    try {
      const { error } = await supabase
        .from('daveops_tutorials')
        .update({ published: !tutorial.published })
        .eq('id', tutorial.id);

      if (error) throw error;
      fetchTutorials();
    } catch (error) {
      console.error('Error toggling published status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      difficulty_level: 'beginner',
      estimated_duration: 30,
      tags: '',
      image_url: '',
      published: true,
      coming_soon: false,
      sort_order: 0
    });
    setEditingTutorial(null);
    setIsCreating(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tutorials Management</h1>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Tutorial
          </Button>
        </div>

        {isCreating && (
          <Card>
            <CardHeader>
              <CardTitle>{editingTutorial ? 'Edit Tutorial' : 'Create New Tutorial'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Difficulty Level</label>
                    <select
                      value={formData.difficulty_level}
                      onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={10}
                    placeholder="Write your tutorial content here..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Estimated Duration (minutes)</label>
                    <Input
                      type="number"
                      value={formData.estimated_duration}
                      onChange={(e) => setFormData({ ...formData, estimated_duration: parseInt(e.target.value) || 30 })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Sort Order</label>
                    <Input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Image URL</label>
                    <Input
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Tags (comma-separated)</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="React, TypeScript, Tutorial"
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    />
                    <span className="text-sm">Published</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.coming_soon}
                      onChange={(e) => setFormData({ ...formData, coming_soon: e.target.checked })}
                    />
                    <span className="text-sm">Coming Soon</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingTutorial ? 'Update' : 'Create'} Tutorial
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Tutorials</CardTitle>
            <CardDescription>Manage your tutorials</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tutorials.map((tutorial) => (
                  <TableRow key={tutorial.id}>
                    <TableCell className="font-medium">{tutorial.title}</TableCell>
                    <TableCell className="capitalize">{tutorial.difficulty_level}</TableCell>
                    <TableCell>{tutorial.estimated_duration} min</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublished(tutorial)}
                        className="flex items-center gap-1"
                      >
                        {tutorial.published ? (
                          <>
                            <Eye className="h-3 w-3" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            Draft
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(tutorial)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(tutorial.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTutorials;
