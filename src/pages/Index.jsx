import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { CSVLink } from 'react-csv';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Download, Upload } from 'lucide-react';

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      complete: (results) => {
        setHeaders(results.data[0]);
        setCsvData(results.data.slice(1));
      },
      header: false,
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleEdit = (rowIndex, colIndex, value) => {
    const newData = [...csvData];
    newData[rowIndex][colIndex] = value;
    setCsvData(newData);
  };

  const addRow = () => {
    const newRow = new Array(headers.length).fill('');
    setCsvData([...csvData, newRow]);
  };

  const deleteRow = (rowIndex) => {
    const newData = csvData.filter((_, index) => index !== rowIndex);
    setCsvData(newData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">CSV Editor</h1>
      
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center cursor-pointer">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the CSV file here ...</p>
        ) : (
          <div>
            <Upload className="mx-auto mb-2" />
            <p>Drag 'n' drop a CSV file here, or click to select one</p>
          </div>
        )}
      </div>

      {csvData.length > 0 && (
        <>
          <Table className="mb-4">
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <TableCell key={colIndex}>
                      <Input
                        value={cell}
                        onChange={(e) => handleEdit(rowIndex, colIndex, e.target.value)}
                        className="w-full"
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="destructive" size="icon" onClick={() => deleteRow(rowIndex)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between mb-4">
            <Button onClick={addRow}>
              <Plus className="mr-2 h-4 w-4" /> Add Row
            </Button>
            <CSVLink
              data={[headers, ...csvData]}
              filename="edited_data.csv"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              <Download className="mr-2 h-4 w-4" /> Download CSV
            </CSVLink>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
