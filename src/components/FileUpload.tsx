import React, { useEffect, useRef, useState } from 'react';
import { Button, FormHelperText, FormLabel } from '@mui/material';
import axios, { AxiosProgressEvent } from 'axios';
import { toast } from 'react-hot-toast';
import { FiCopy } from 'react-icons/fi';

import { FileInterface } from '../interface/AwsInterface';
import { Axios } from '../helpers/axios';
// import { uploadLoader } from '../utils/images';
import { saveAs } from 'file-saver';
import './fileupload.css';
import copy from 'copy-to-clipboard';

export const FileUpload: React.FC<any> = ({ name, label, formik, ...rest }) => {
  const { touched, error } = formik.getFieldMeta(name);
  const { setValue } = formik.getFieldHelpers(name);
  const isError = touched && error ? true : false;
  const [uploadFile, setUploadFile] = useState<any>();

  const [shortUrl, setShortUrl] = useState('');

  const awsUrl = uploadFile && uploadFile.uploadLocation;

  useEffect(() => {
    if (awsUrl) {
      handleCreateShortLink(awsUrl);
    }
  }, [awsUrl]);

  const handleCreateShortLink = async (url: string) => {
    try {
      const { data } = await Axios.post('file/create-short-url', {
        url: url,
      });
      const shortId = data.data.shortId;
      setShortUrl(`${process.env.REACT_APP_API_URL}/file/${shortId}`);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || 'Sorry Something went wrong!';
      toast.error(msg);
    }
  };

  const handleFileDropped = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    const dragFiles = files[0] as unknown as FileInterface;
    // setValue(dragFiles);
    setUploadFile(dragFiles);
    await getSignedUrl(dragFiles);
  };

  const getSignedUrl = async (file: FileInterface) => {
    const item = {
      fileName: file.name,
      fileType: file.type,
    };
    try {
      const { data } = await Axios.get('aws/get-aws-url', {
        params: item,
      });
      const { keyFile, url } = data;
      await uploadToAws(url, keyFile, file);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || 'Sorry Something went wrong!';
      toast.error(msg);
    }
  };

  const uploadToAws = async (
    url: string,
    keyFile: string,
    file: FileInterface
  ) => {
    await axios.put(url, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (event: AxiosProgressEvent) => {
        const { loaded, total } = event;
        const percentage = total ? Math.round((100 * loaded) / total) : 0;
        file['progress'] = percentage;
        // setValue(file);
        setUploadFile(file);
      },
    });
    file['isUploadCompleted'] = true;
    file[
      'uploadLocation'
    ] = `https://${process.env.REACT_APP_S3_BUCKET_NAME}.s3.${process.env.REACT_APP_S3_BUCKET_REGION}.amazonaws.com/${keyFile}`;
    setValue(file['uploadLocation']);
    setUploadFile(file);
    toast.success('File uploaded', {
      position: 'top-center',
    });
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDownload = (url: string) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const timestamp = Date.now();
        const fileName = `${timestamp}`;
        saveAs(blob, fileName);
        toast.success('File Downloaded', {
          position: 'top-center',
        });
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  };

  // const copyLink = () => {
  //   navigator.clipboard.writeText(shortUrl).then(
  //     () => {
  //       toast.success('Link copied to clipboard.', {
  //         position: 'top-center',
  //       });
  //     },
  //     () => {
  //       toast.success("Error ! Can't copy the link");
  //     }
  //   );
  // };

  const copyLink = () => {
    if (copy(shortUrl)) {
      toast.success('Link copied to clipboard.', {
        position: 'top-center',
      });
    } else {
      toast.error("Error! Can't copy the link.");
    }
  };

  return (
    <div className='fileUploadInputDiv'>
      <FormLabel error={isError}>
        <p>{label}</p>
        <input
          className='fileUploadInput'
          ref={inputRef}
          type='file'
          name={name}
          onChange={handleFileDropped}
          {...rest}
        />

        {uploadFile &&
          uploadFile?.progress !== 0 &&
          !uploadFile.isUploadCompleted && <p>Wait File is uploading</p>}

        <FormHelperText error={isError}>
          {isError ? error : null}
        </FormHelperText>
      </FormLabel>
      {awsUrl && (
        <Button onClick={() => handleDownload(awsUrl)}>Download File</Button>
      )}
      {shortUrl && (
        <div className='shCopyLink'>
          <input type='text' className='copyinput' value={shortUrl} disabled />
          <div className='shCopyLink-button'>
            <FiCopy
              className='shCopyIcon'
              id='copyLink'
              onClick={copyLink}
              color='#5F4B85'
            />
          </div>
        </div>
      )}
    </div>
  );
};
