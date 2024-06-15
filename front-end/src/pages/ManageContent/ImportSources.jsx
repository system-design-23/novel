import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/utils';
import { Button, Input, LoadingSpinner } from '../../components';
import { addNewPlugin, getPluginCode, getPlugins, removePlugin, statusPolling } from '../../apis/plugins';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { FilePlus, Trash } from 'lucide-react';
import getNewSampleCode from './emptyCodeClass';
import addFileImage from '../../assets/add_file.png';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/Popover/Popover';
import { useToast } from '../../hooks/useToast';

const failedFetch = 'Failed to fetch code.';

const ImportSources = ({ className, ...rest }) => {
  const [visiblePlugins, setVisiblePlugins] = useState([]);
  const [pluginLoading, setPluginLoading] = useState(null);
  const [code, setCode] = useState(null);
  const [isCreatingNewCodeFile, setCreateNewCodeFile] = useState(false);
  const [isUploading, setIsUploading] = useState(-1);
  const isFetching = useRef(false);
  const { toast } = useToast();
  const [currentlyEditingDomain, setCurrentDomain] = useState(null);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (isFetching.current) return;
    const fetchSuppliers = async () => {
      isFetching.current = true;
      const result = await getPlugins();
      if (result) {
        setVisiblePlugins(result.map((supplier) => ({ supplier: supplier.domain_name })));
      }
    };
    fetchSuppliers();

    return () => {
      isFetching.current = false;
    };
  }, []);

  const handleLoadSourceCode = async (domain) => {
    const result = await getPluginCode(domain);
    if (result) {
      setCurrentDomain(domain);
      setCode(result);
    } else {
      setCurrentDomain(null);
      setCode(failedFetch);
    }
    setPluginLoading(null);
  };

  const handleGetNewSourceCode = (e) => {
    e.preventDefault();
    const url = e.target[0].value;
    setCurrentDomain(url);
    setCode(getNewSampleCode(url));
    setCreateNewCodeFile(false);
  };

  const handleDeleleteSourceCode = async (sourceDomain) => {
    const result = await removePlugin(sourceDomain);
    if (result) {
      setVisiblePlugins((prev) => prev.filter((supplier) => supplier.supplier !== sourceDomain));
      setCode(null);
      toast({ title: 'Success', description: 'Successfully deleted the sources.' });
    }
  };

  const handleUploadNewSourceCode = async (e) => {
    setIsUploading(0);
    const result = await addNewPlugin(currentlyEditingDomain, code);
    if (result) {
      const closeConnection = await statusPolling(result, handlePollChecking);
      eventSourceRef.current = closeConnection;
    }
  };

  const handlePollChecking = (result) => {
    result = result.slice(1, result.length - 1);
    result = parseInt(result);
    if (result != NaN) {
      setIsUploading(result);
    }
    if (result === 100) {
      setCode(null);
      const currentDomain = currentlyEditingDomain.split('/')[2];
      if (visiblePlugins.find((x) => x.supplier === currentDomain) == undefined && eventSourceRef.current) {
        setVisiblePlugins((prev) => [...prev, { supplier: currentDomain }]);
        toast({ title: 'Success', description: 'Successfully uploaded the sources.' });
      }
      setCurrentDomain(null);
      if (eventSourceRef.current) {
        const closeConnection = eventSourceRef.current;
        closeConnection();
        eventSourceRef.current = null;
      }
    }
  };

  return (
    <section
      className={cn('mx-auto h-fit max-h-full w-4/5 flex-grow rounded-lg bg-slate-50 p-6', className ?? '')}
      {...rest}
    >
      <h2 className='mb-2 text-lg font-semibold'>Novel Supply Sources</h2>
      <p className='text-sm text-slate-600'>Edit or add new novel supplier plugin into the system.</p>
      <section className='justify-left mt-5 flex max-w-full space-x-4 overflow-x-auto'>
        {visiblePlugins.length > 0 ? (
          visiblePlugins &&
          visiblePlugins.map((supplier) => {
            return (
              <button
                key={supplier.supplier}
                className={cn(
                  'h-12 min-w-fit rounded bg-slate-100',
                  'border-2 border-slate-200 font-normal text-slate-800',
                  'flex select-none items-center justify-between overflow-hidden px-8'
                )}
                onClick={() => {
                  setPluginLoading(supplier.supplier);
                  handleLoadSourceCode(supplier.supplier);
                }}
              >
                <div className='flex space-x-2 align-middle'>
                  {pluginLoading === supplier.supplier && <LoadingSpinner className='w-4' />}
                  <p className='self-center text-nowrap text-sm'> {supplier.supplier} </p>
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
            <PopoverContent sideOffset='1' className='w-fit rounded-lg bg-slate-50 p-0 align-middle'>
              <form className='px- h-fit w-full space-y-4 p-4' onSubmit={handleGetNewSourceCode}>
                <h1 className='text-base font-semibold'>Add Domain URL</h1>
                <Input className='w-full' placeholder='https://example.com' name='url'></Input>
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
            <p className='-mt-4 text-sm text-slate-500'>Choose a source file to edit or add new source.</p>
          </div>
        )}
      </section>
      <section className={cn('mt-4 flex justify-end space-x-2', (code === null || code === failedFetch) && 'hidden')}>
        <Button
          variant='destructive'
          className={cn(
            'ml-0 mr-auto flex space-x-2 align-middle',
            visiblePlugins.find((x) => x.supplier === currentlyEditingDomain) == null && 'hidden'
          )}
          onClick={() => {
            if (currentlyEditingDomain) {
              handleDeleleteSourceCode(currentlyEditingDomain);
            }
          }}
        >
          <Trash size='1rem' className='self-center text-white' />
          <p className='self-center text-nowrap text-sm'> Delete Source </p>
        </Button>
        <Button
          variant='secondary'
          className={cn(currentlyEditingDomain == null && 'hidden')}
          disabled={isUploading >= 0 && isUploading < 100}
          onClick={() => {
            setCurrentDomain(null);
            setCode(null);
          }}
        >
          Cancel
        </Button>

        <Button
          className={cn(
            'hidden justify-center space-x-2 align-middle',
            visiblePlugins.find((x) => x.supplier === currentlyEditingDomain) == null && 'flex'
          )}
          disabled={isUploading >= 0 && isUploading < 100}
          onClick={handleUploadNewSourceCode}
        >
          {isUploading >= 0 && isUploading < 100 && <LoadingSpinner className='w-4 fill-white stroke-white' />}
          <p>Update</p>
        </Button>
      </section>
      {isUploading >= 0 && isUploading < 100 && (
        <div className='relative my-2 h-[5px] w-full overflow-hidden rounded-full bg-slate-200'>
          <div
            style={{ transform: `scaleX(${isUploading / 100.0})` }}
            className='absolute bottom-0 left-0 top-0 h-[5px] w-full origin-left rounded-full bg-primary transition-all duration-200'
          ></div>
        </div>
      )}
    </section>
  );
};

export default ImportSources;
