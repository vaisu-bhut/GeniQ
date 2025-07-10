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
  Download,
  Code,
  Info,
  Settings,
  List,
  FileText,
  Table
} from 'lucide-react';
import { apiService, type ColumnDefinition, type TabularRequest } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const TabularDataSection = () => {
  const [columns, setColumns] = useState<ColumnDefinition[]>([
    { name: 'User ID', dtype: 'int', description: 'Unique user identifier', validation: '>0', options: [] },
    { name: 'Email', dtype: 'str', description: 'User email address', validation: "contains('@')", options: [] },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rowCount, setRowCount] = useState([50]);
  const [useCase, setUseCase] = useState('');
  const [datasetDescription, setDatasetDescription] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [showColumnDetails, setShowColumnDetails] = useState<number | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, string>[]>([]);
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const { toast } = useToast();

  const columnTypes = [
    { value: 'int', label: 'Integer', description: 'Whole numbers' },
    { value: 'float', label: 'Float', description: 'Decimal numbers' },
    { value: 'str', label: 'String', description: 'Text data' },
    { value: 'bool', label: 'Boolean', description: 'True/False values' },
    { value: 'datetime', label: 'DateTime', description: 'Date and time' },
  ];

  const validationExamples = [
    { type: 'int', examples: ['>0', '>=18 and <=100', 'between(1, 1000)'] },
    { type: 'float', examples: ['>0.0', 'between(0.0, 1.0)', '>=10.5'] },
    { type: 'str', examples: ["contains('@')", "length >= 3", "matches('^[A-Za-z]+$')"] },
    { type: 'bool', examples: ['true', 'false', 'random'] },
    { type: 'datetime', examples: ['>=2020-01-01', 'between(2020-01-01, 2024-12-31)'] },
  ];

  const addColumn = () => {
    setColumns([...columns, { name: '', dtype: 'str', description: '', validation: '', options: [] }]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const addOption = (columnIndex: number) => {
    const newColumns = [...columns];
    newColumns[columnIndex].options = [...(newColumns[columnIndex].options || []), ''];
    setColumns(newColumns);
  };

  const removeOption = (columnIndex: number, optionIndex: number) => {
    const newColumns = [...columns];
    newColumns[columnIndex].options = newColumns[columnIndex].options?.filter((_, i) => i !== optionIndex) || [];
    setColumns(newColumns);
  };

  const updateOption = (columnIndex: number, optionIndex: number, value: string) => {
    const newColumns = [...columns];
    if (newColumns[columnIndex].options) {
      newColumns[columnIndex].options[optionIndex] = value;
      setColumns(newColumns);
    }
  };

  const getApiRequest = (): TabularRequest => ({
    columns: columns.map(col => ({
      name: col.name,
      dtype: col.dtype,
      description: col.description,
      validation: col.validation || '',
      options: col.options || [],
    })),
    num_rows: rowCount[0],
    description: datasetDescription || `Generated dataset with ${rowCount[0]} rows`,
    use_case: useCase || 'General data generation',
    output_format: 'csv',
  });

  const loadPreviewData = async (url: string) => {
    setIsLoadingPreview(true);
    try {
      const response = await fetch(url);
      const text = await response.text();
      
      // Parse CSV data
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length === 0) {
        throw new Error('No data found in file');
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const data = lines.slice(1, 4).map(line => { // Show first 3 rows
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      setPreviewHeaders(headers);
      setPreviewData(data);
      setShowPreview(true);
    } catch (error) {
      console.error('Error loading preview:', error);
      toast({
        title: "Preview Error",
        description: "Could not load preview data. The file may be empty or corrupted.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPreview(false);
    }
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
    setShowPreview(false);
    
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
      const request = getApiRequest();
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

  const handlePreview = () => {
    if (downloadUrl) {
      loadPreviewData(downloadUrl);
    }
  };

  const isValid = columns.every(col => col.name && col.description);

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
                        <option key={type.value} value={type.value}>
                          {type.label} - {type.description}
                        </option>
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
                    placeholder="Column description (required)"
                    value={column.description}
                    onChange={(e) => {
                      const newColumns = [...columns];
                      newColumns[index].description = e.target.value;
                      setColumns(newColumns);
                    }}
                    className="text-sm"
                  />

                  {/* Advanced Column Settings */}
                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowColumnDetails(showColumnDetails === index ? null : index)}
                      className="w-full justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Advanced Settings
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {showColumnDetails === index ? 'Hide' : 'Show'}
                      </span>
                    </Button>

                    {showColumnDetails === index && (
                      <div className="space-y-3 p-3 bg-muted/20 rounded-lg">
                        {/* Validation Rules */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Validation Rules</label>
                          <Input
                            placeholder="e.g., >0, >=18 and <=100, contains('@')"
                            value={column.validation || ''}
                            onChange={(e) => {
                              const newColumns = [...columns];
                              newColumns[index].validation = e.target.value;
                              setColumns(newColumns);
                            }}
                            className="text-sm"
                          />
                          <div className="text-xs text-muted-foreground mt-1">
                            Examples: {validationExamples.find(v => v.type === column.dtype)?.examples.join(', ')}
                          </div>
                        </div>

                        {/* Options for Categorical Data */}
                        <div>
                          <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                            <List className="w-4 h-4" />
                            Options (for categorical data)
                          </label>
                          <div className="space-y-2">
                            {column.options?.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex gap-2">
                                <Input
                                  placeholder="Option value"
                                  value={option}
                                  onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                  className="text-sm"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeOption(index, optionIndex)}
                                  className="text-destructive hover:text-destructive-foreground"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addOption(index)}
                              className="w-full"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Option
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    {column.name && column.description ? (
                      <CheckCircle className="w-4 h-4 text-accent" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    )}
                    <span className={column.name && column.description ? "text-accent" : "text-destructive"}>
                      {column.name && column.description ? "Valid" : "Name and description required"}
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
            {/* Dataset Description */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Dataset Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Use Case</label>
                  <Input 
                    placeholder="e.g., Customer analytics, ML training, Testing..."
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                    className="mb-2"
                  />
                  <div className="text-xs text-muted-foreground">
                    Describe how this dataset will be used
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Detailed Description</label>
                  <textarea
                    placeholder="Provide a detailed description of the dataset, its purpose, and any specific requirements..."
                    value={datasetDescription}
                    onChange={(e) => setDatasetDescription(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-input border border-border rounded-md text-foreground resize-none"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    This description will be used by the AI to generate more relevant data
                  </div>
                </div>
              </CardContent>
            </Card>

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
                    max={1000}
                    min={1}
                    step={1}
                    className="mb-3"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>1</span>
                    <span>1,000</span>
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    Processing time: 10 seconds to 3 minutes
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
                    disabled={!isValid}
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
                      <Button variant="outline" onClick={handlePreview} disabled={isLoadingPreview}>
                        {isLoadingPreview ? (
                          <>
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                            Loading...
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </>
                        )}
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

            {/* Real Data Preview */}
            {showPreview && previewData.length > 0 && (
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Table className="w-5 h-5 text-accent" />
                    Generated Data Preview
                    <Badge variant="outline" className="ml-auto">
                      {previewData.length} rows shown
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          {previewHeaders.map((header, i) => (
                            <th key={i} className="text-left p-2 font-medium">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, i) => (
                          <tr key={i} className="border-b border-border/50">
                            {previewHeaders.map((header, j) => (
                              <td key={j} className="p-2 text-muted-foreground">
                                {row[header] || ''}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-xs text-muted-foreground mt-3 text-center">
                    Showing first 3 rows of {rowCount[0].toLocaleString()} total rows
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