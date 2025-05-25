
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

interface AboutContent {
  id: string;
  section_key: string;
  title: string;
  content: string;
  image_url: string;
  published: boolean;
  sort_order: number;
  updated_at: string;
}

const AdminAbout = () => {
  const [content, setContent] = useState<AboutContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingContent, setEditingContent] = useState<AboutContent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    section_key: '',
    title: '',
    content: '',
    image_url: '',
    published: true,
    sort_order: 0
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('daveops_about_content')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching about content:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch about content',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingContent) {
        const { error } = await supabase
          .from('daveops_about_content')
          .update(formData)
          .eq('id', editingContent.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Content updated successfully' });
      } else {
        const { error } = await supabase
          .from('daveops_about_content')
          .insert([formData]);

        if (error) throw error;
        toast({ title: 'Success', description: 'Content created successfully' });
      }

      resetForm();
      fetchContent();
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'Error',
        description: 'Failed to save content',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (content: AboutContent) => {
    setEditingContent(content);
    setFormData({
      section_key: content.section_key,
      title: content.title || '',
      content: content.content || '',
      image_url: content.image_url || '',
      published: content.published,
      sort_order: content.sort_order
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content section?')) return;

    try {
      const { error } = await supabase
        .from('daveops_about_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Success', description: 'Content deleted successfully' });
      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete content',
        variant: 'destructive'
      });
    }
  };

  const togglePublished = async (content: AboutContent) => {
    try {
      const { error } = await supabase
        .from('daveops_about_content')
        .update({ published: !content.published })
        .eq('id', content.id);

      if (error) throw error;
      fetchContent();
    } catch (error) {
      console.error('Error toggling published status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      section_key: '',
      title: '',
      content: '',
      image_url: '',
      published: true,
      sort_order: 0
    });
    setEditingContent(null);
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
          <h1 className="text-3xl font-bold">About Content Management</h1>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Content Section
          </Button>
        </div>

        {isCreating && (
          <Card>
            <CardHeader>
              <CardTitle>{editingContent ? 'Edit Content Section' : 'Create New Content Section'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Section Key</label>
                    <Input
                      value={formData.section_key}
                      onChange={(e) => setFormData({ ...formData, section_key: e.target.value })}
                      placeholder="hero, skills, experience"
                      required
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
                </div>

                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    placeholder="Write your content here..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Image URL</label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    />
                    <span className="text-sm">Published</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingContent ? 'Update' : 'Create'} Content
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
            <CardTitle>About Content Sections</CardTitle>
            <CardDescription>Manage your about page content</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Section Key</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {content.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.section_key}</TableCell>
                    <TableCell>{item.title || 'No title'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublished(item)}
                        className="flex items-center gap-1"
                      >
                        {item.published ? (
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
                    <TableCell>{item.sort_order}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
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

export default AdminAbout;
