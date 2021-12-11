import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { BasicForm } from '../components/templates/BasicForm';
import { ValidationForm } from '../components/templates/ValidationForm';
import { DefaultValueForm } from '../components/templates/DefaultValueForm';
import { TypedForm } from '../components/templates/TypedForm';
import { JobApplicationForm } from '../components/templates/PracticalForm';

const Home: NextPage = function () {
  return (
    <div>
      <Head>
        <title>Form Practice</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          <h1>Basic Form</h1>
          <BasicForm />
          <h1>Validation Form</h1>
          <ValidationForm />
          <h1>Default Value</h1>
          {/* <DefaultValueForm />
          <h1>Typed Form</h1>
          <TypedForm /> */}
          <h1>Practical Form</h1>
          <JobApplicationForm />
        </div>
      </main>
    </div>
  );
};

export default Home;
