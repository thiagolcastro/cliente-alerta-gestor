
import { useState } from 'react';
import { Plus, X, Edit2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export interface ClientTag {
  id: string;
  name: string;
  color: string;
}

interface ClientTagsProps {
  clientId: string;
  tags: ClientTag[];
  availableTags: ClientTag[];
  onAddTag: (clientId: string, tag: ClientTag) => void;
  onRemoveTag: (clientId: string, tagId: string) => void;
  onCreateTag: (tag: Omit<ClientTag, 'id'>) => void;
  editable?: boolean;
}

const predefinedColors = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-red-100 text-red-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
  'bg-gray-100 text-gray-800'
];

const ClientTags = ({ 
  clientId, 
  tags, 
  availableTags, 
  onAddTag, 
  onRemoveTag, 
  onCreateTag,
  editable = true 
}: ClientTagsProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0]);

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      onCreateTag({
        name: newTagName.trim(),
        color: selectedColor
      });
      setNewTagName('');
      setShowAddForm(false);
    }
  };

  const unusedTags = availableTags.filter(
    availableTag => !tags.some(tag => tag.id === availableTag.id)
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <Badge key={tag.id} className={`${tag.color} relative group`}>
            {tag.name}
            {editable && (
              <button
                onClick={() => onRemoveTag(clientId, tag.id)}
                className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>

      {editable && (
        <div className="space-y-2">
          {unusedTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {unusedTags.slice(0, 3).map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => onAddTag(clientId, tag)}
                  className={`text-xs px-2 py-1 rounded-full border-2 border-dashed ${tag.color} hover:opacity-80 transition-opacity`}
                >
                  + {tag.name}
                </button>
              ))}
            </div>
          )}

          {!showAddForm ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="h-6 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Nova etiqueta
            </Button>
          ) : (
            <Card className="p-3">
              <CardContent className="p-0 space-y-3">
                <Input
                  placeholder="Nome da etiqueta"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="h-8"
                />
                <div className="grid grid-cols-4 gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`h-6 rounded border-2 ${
                        selectedColor === color ? 'border-gray-800' : 'border-gray-200'
                      } ${color.split(' ')[0]}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleCreateTag}
                    className="h-7 text-xs"
                  >
                    Criar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                    className="h-7 text-xs"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientTags;
