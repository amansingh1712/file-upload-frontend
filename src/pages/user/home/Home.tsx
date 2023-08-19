import { useFormik } from 'formik';
import React from 'react';
import axios from 'axios';

import { toast } from 'react-hot-toast';
import { FormikControl } from '../../../components/FormikControl';
import './home.css';

const Home = () => {
  const initialValues: any = {
    file: '',
  };

  const updateDispensariesDetails = async (values: any) => {
    try {
      const {
        data: { data },
      } = await axios.put(`aws/get-aws-url`, {
        update: values,
      });
      toast.success('File uploaded successfully');
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || 'Sorry Something went wrong!';
      toast.error(msg);
    }
  };
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: updateDispensariesDetails,
  });
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className='apInputRight'>
          <h2 className='clInputH2'>Upload File</h2>
          <FormikControl
            control='upload'
            type='file'
            name='file'
            formik={formik}
          />
          {/* {!formik.values.profilePhoto && (
            <div className='imageInput'>
              <h2 className='imgInputH2'>Upload Image</h2>
              <p className='imgInputP'>
                select from folder or drag and drop file here.
              </p>
            </div>
          )} */}
        </div>
      </form>
    </>
  );
};

export default Home;
