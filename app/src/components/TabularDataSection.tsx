import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Trash2, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  Database,
  Play,
  Download
} from 'lucide-react';
import { apiService, type ColumnDefinition, type TabularRequest } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const TabularDataSection = () => {
  const [columns, setColumns] = useState<ColumnDefinition[]>([
    { name: 'User ID', dtype: 'int', description: 'Unique user identifier' },
    { name: 'Email', dtype: 'str', description: 'User email address' },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rowCount, setRowCount] = useState([1000]);
  const [useCase, setUseCase] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const columnTypes = ['int', 'float', 'str', 'bool', 'datetime'];

  const addColumn = () => {
    setColumns([...columns, { name: '', dtype: 'str', description: '' }]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const startGeneration = async () => {
    if (columns.some(col => !col.name)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all column names before generating data.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setDownloadUrl(null);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const request: TabularRequest = {
        columns: columns.map(col => ({
          name: col.name,
          dtype: col.dtype,
          description: col.description,
          validation: col.validation || '',
          options: col.options || [],
        })),
        num_rows: rowCount[0],
        description: `Generated dataset with ${rowCount[0]} rows`,
        use_case: useCase || 'General data generation',
        output_format: 'csv',
      };

      const response = await apiService.generateTabularData(request);
      
      clearInterval(progressInterval);
      setProgress(100);

      if (response.success && response.downloadUrl) {
        setDownloadUrl(response.downloadUrl);
        toast({
          title: "Success!",
          description: `Generated ${rowCount[0].toLocaleString()} rows of data successfully.`,
        });
      } else {
        throw new Error(response.error || 'Generation failed');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      apiService.downloadFile(downloadUrl, `tabular_dataset_${Date.now()}.csv`);
    }
  };

  return (
    <section id="tabular" className="relative min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            <span className="text-gradient">Tabular Data</span>
            <span className="text-foreground"> Generator</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Build perfect datasets with intelligent column generation and real-time validation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Column Builder */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-accent" />
                Column Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {columns.map((column, index) => (
                <div key={index} className="space-y-3 p-4 border border-border rounded-lg hover:border-accent/50 transition-colors">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Column name"
                      value={column.name}
                      onChange={(e) => {
                        const newColumns = [...columns];
                        newColumns[index].name = e.target.value;
                        setColumns(newColumns);
                      }}
                      className="flex-1"
                    />
                    <select 
                      value={column.dtype}
                      onChange={(e) => {
                        const newColumns = [...columns];
                        newColumns[index].dtype = e.target.value;
                        setColumns(newColumns);
                      }}
                      className="px-3 py-2 bg-input border border-border rounded-md text-foreground"
                    >
                      {columnTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeColumn(index)}
                      className="text-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Input
                    placeholder="Column description"
                    value={column.description}
                    onChange={(e) => {
                      const newColumns = [...columns];
                      newColumns[index].description = e.target.value;
                      setColumns(newColumns);
                    }}
                    className="text-sm"
                  />
                  
                  <div className="flex items-center gap-2 text-sm">
                    {column.name ? (
                      <CheckCircle className="w-4 h-4 text-accent" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    )}
                    <span className={column.name ? "text-accent" : "text-destructive"}>
                      {column.name ? "Valid" : "Name required"}
                    </span>
                  </div>
                </div>
              ))}
              
              <Button 
                onClick={addColumn}
                variant="outline" 
                className="w-full border-dashed border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Column
              </Button>
            </CardContent>
          </Card>

          {/* Configuration & Preview */}
          <div className="space-y-6">
            {/* Parameters */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Data Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Number of Rows: {rowCount[0].toLocaleString()}
                  </label>
                  <Slider
                    value={rowCount}
                    onValueChange={setRowCount}
                    max={50}
                    min={5}
                    step={5}
                    className="mb-3"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5</span>
                    <span>50</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Use Case</label>
                  <Input 
                    placeholder="e.g., Customer analytics, ML training..."
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                    className="mb-2"
                  />
                  <div className="text-xs text-muted-foreground">
                    AI will suggest appropriate data patterns
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generation */}
            <Card className="glass">
              <CardContent className="p-6">
                {!isGenerating && progress === 0 && (
                  <Button 
                    onClick={startGeneration}
                    className="w-full bg-gradient-accent text-accent-foreground text-lg py-6 hover:scale-105 transition-transform"
                    disabled={columns.some(col => !col.name)}
                  >
                    <Sparkles className="w-6 h-6 mr-3 animate-spin" />
                    Generate Dataset
                  </Button>
                )}

                {isGenerating && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold mb-2">Generating Data...</div>
                      <div className="text-sm text-muted-foreground">Creating {rowCount[0].toLocaleString()} rows</div>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <div className="text-sm text-center">{Math.round(progress)}% Complete</div>
                  </div>
                )}

                {!isGenerating && progress === 100 && downloadUrl && (
                  <div className="space-y-4">
                    <div className="text-center text-accent font-semibold mb-4">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                      Dataset Generated Successfully!
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button className="bg-gradient-primary" onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Live Preview */}
            {progress > 0 && (
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          {columns.map((col, i) => (
                            <th key={i} className="text-left p-2 font-medium">{col.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 3 }).map((_, i) => (
                          <tr key={i} className="border-b border-border/50">
                            {columns.map((col, j) => (
                              <td key={j} className="p-2 text-muted-foreground">
                                {col.dtype === 'str' ? `Sample ${i + 1}` :
                                 col.dtype === 'int' ? (1000 + i) :
                                 col.dtype === 'float' ? (1000.5 + i) :
                                 col.dtype === 'bool' ? (i % 2 === 0 ? 'True' : 'False') :
                                 'Sample data'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TabularDataSection;