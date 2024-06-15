import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/utils';
import { Button, Input, LoadingSpinner } from '../../components';
import { addNewFormat, getFormatCode, getFormats, removeFormat } from '../../apis/formats';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { FilePlus, Trash } from 'lucide-react';
import getNewSampleCode from './emptyCodeClass';
import addFileImage from '../../assets/add_file.png';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/Popover/Popover';
import getNewExportCode from './emptyExportCodeClass';
import { useToast } from '../../hooks/useToast';

const failedFetch = 'Failed to fetch code.';

const ExportSources = ({ className, ...rest }) => {
  const [visibleFormats, setVisibleFormats] = useState([]);
  const [formatLoading, setFormatLoading] = useState(null);
  const [code, setCode] = useState(null);
  const [isCreatingNewCodeFile, setCreateNewCodeFile] = useState(false);
  const isFetching = useRef(false);
  const { toast } = useToast();
  const currentlyEditingFormat = useRef(null);

  useEffect(() => {
    if (isFetching.current) return;
    const fetchSuppliers = async () => {
      isFetching.current = true;
      const result = await getFormats();
      if (result) {
        setVisibleFormats(result);
      }
    };
    fetchSuppliers();

    return () => {
      isFetching.current = false;
    };
  }, []);

  const handleLoadSourceCode = async (format) => {
    const result = await getFormatCode(format);
    if (result) {
      currentlyEditingFormat.current = format;
      setCode(result);
    } else {
      currentlyEditingFormat.current = null;
      setCode(failedFetch);
    }
    setFormatLoading(null);
  };

  const handleGetNewSourceCode = (e) => {
    e.preventDefault();
    const dependency = e.target[1].value;
    currentlyEditingFormat.current = {
      format_name: e.target[0].value,
      dependency: dependency
    };
    setCode(getNewExportCode(dependency));
    setCreateNewCodeFile(false);
  };

  const handleDeleleteSourceCode = async (sourceFormat) => {
    const result = await removeFormat(sourceFormat);
    if (result) {
      setVisibleFormats((prev) => prev.filter((format) => format !== sourceFormat));
      setCode(null);
      toast({ title: 'Success', description: 'Successfully deleted the sources.' });
    }
  };

  const handleUploadNewSourceCode = async (e) => {
    // disable the button
    e.target.disabled = true;
    const result = await addNewFormat(
      currentlyEditingFormat.current.format_name,
      currentlyEditingFormat.current.dependency,
      code
    );
    if (result) {
      const currentFormat = currentlyEditingFormat.current.format_name;
      setVisibleFormats((prev) => [...prev, currentFormat]);
      setCode(null);
      currentlyEditingFormat.current = null;
      toast({ title: 'Success', description: 'Successfully added the export format.' });
    }
    e.target.disabled = false;
  };

  return (
    <section
      className={cn('mx-auto h-fit max-h-full w-4/5 flex-grow rounded-lg bg-slate-50 p-6', className ?? '')}
      {...rest}
    >
      <h2 className='mb-2 text-lg font-semibold'>Export Formats</h2>
      <p className='text-sm text-slate-600'>Edit or add new export format plugin into the system.</p>
      <section className='justify-left mt-5 flex max-w-full space-x-4 overflow-x-auto'>
        {visibleFormats.length > 0 ? (
          visibleFormats &&
          visibleFormats.map((format) => {
            return (
              <button
                key={format}
                className={cn(
                  'h-12 min-w-fit rounded bg-slate-100',
                  'border-2 border-slate-200 font-normal text-slate-800',
                  'flex select-none items-center justify-between overflow-hidden px-8'
                )}
                onClick={() => {
                  setFormatLoading(format);
                  handleLoadSourceCode(format);
                }}
              >
                <div className='flex space-x-2 align-middle'>
                  {formatLoading === format && <LoadingSpinner className='w-4' />}
                  <p className='self-center text-nowrap text-sm'> {format} </p>
                </div>
              </button>
            );
          })
        ) : (
          <div className='flex h-full items-center justify-center self-center'>
            <LoadingSpinner />
          </div>
        )}
        <div
          className={cn(
            'ml-auto h-12 min-w-fit rounded',
            'border-2 border-transparent text-slate-800 hover:border-slate-200',
            'flex select-none items-center justify-between overflow-hidden px-2'
          )}
        >
          <Popover open={isCreatingNewCodeFile} onOpenChange={setCreateNewCodeFile}>
            <PopoverTrigger asChild>
              <button className='flex space-x-2 align-middle'>
                <FilePlus size='1rem' className='self-center text-slate-800' />
                <p className='self-center text-nowrap text-sm'> Add New Source</p>
              </button>
            </PopoverTrigger>
            <PopoverContent sideOffset='1' className='w-fit min-w-[400px] rounded-lg bg-slate-50 p-0 align-middle'>
              <form className='px- h-fit w-full space-y-4 p-4' onSubmit={handleGetNewSourceCode}>
                <h1 className='text-base font-semibold'>Add Domain URL</h1>
                <Input className='w-full' placeholder='pdf' name='format_name'></Input>
                <Input className='w-full' placeholder='Additional dependency. Ex: pdfkit.' name='dependency'></Input>
                <div className='my-2 flex justify-end'>
                  <Button type='submit' className='w-full'>
                    Create Template
                  </Button>
                </div>
              </form>
            </PopoverContent>
          </Popover>
        </div>
      </section>
      <section
        className={cn(
          'mb-2 mt-4 h-fit w-full rounded-lg p-2',
          code && 'border-2 bg-white',
          code === failedFetch && 'cursor-not-allowed'
        )}
      >
        {code ? (
          <div className='aspect-code-view w-full overflow-y-auto'>
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) => highlight(code, languages.js)}
              padding={10}
              textareaClassName={cn(
                'focus-visible:ring-none border-0 ring-0',
                'focus-within:outline-none focus:outline-none focus:ring-0 focus-visible:outline-none'
              )}
              disabled={code === failedFetch}
              className={cn('font-mono text-[14px]')}
            ></Editor>
          </div>
        ) : (
          <div className='my-4 flex h-full flex-col items-center justify-center'>
            <img src={addFileImage} className='w-[200px]' alt='Add New File' />
            <p className='-mt-4 text-sm text-slate-500'>Choose a source file to edit or add new format.</p>
          </div>
        )}
      </section>
      <section className={cn('mt-4 flex justify-end space-x-2', (code === null || code === failedFetch) && 'hidden')}>
        <Button
          variant='destructive'
          className='ml-0 mr-auto flex space-x-2 align-middle'
          onClick={() => {
            if (currentlyEditingFormat.current) {
              handleDeleleteSourceCode(currentlyEditingFormat.current);
            }
          }}
        >
          <Trash size='1rem' className='self-center text-white' />
          <p className='self-center text-nowrap text-sm'> Delete Format</p>
        </Button>
        <Button
          variant='secondary'
          onClick={() => {
            currentlyEditingFormat.current = null;
            setCode(null);
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleUploadNewSourceCode}>Update</Button>
      </section>
    </section>
  );
};

export default ExportSources;
