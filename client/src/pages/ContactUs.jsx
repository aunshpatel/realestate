import React from 'react';
import { useForm, ValidationError } from '@formspree/react';

export default function ContactForm() {
  const [state, handleSubmit] = useForm("xblrejoj");
  if (state.succeeded) {
      return <p>Thanks for joining!</p>;
  }
  return (
    <>
        <div className='justify-center items-center flex flex-col mb-6 mt-6'>
            <div className="bg-white justify-center items-center w-max shadow-md rounded-lg p-8">
                <h1 className="text-xl font-bold mb-4">Contact Us</h1>
                <form className='flex flex-col' action='https://formspree.io/f/xblrejoj' method='post' encType='multipart/form-data'>
                    <div className='mb-5 border-collapse border-2'>
                        <input id='name' type='text' name='name' placeholder='Your Name' className=' w-96' />
                    </div>
                    <div className='mb-5 border-collapse border-2'>
                        <input id='email' type='email' name='email' placeholder='Your Email ID' className=' w-96' />
                        <ValidationError prefix="Email" field="email"  errors={state.errors} />
                    </div>
                    <div className='mb-5 border-collapse border-2'>
                        <textarea id='message' rows='5' className='w-96' name='message' placeholder='Your Message' />
                        <ValidationError prefix="Message" field="message" errors={state.errors} />
                    </div>
                    <button type="submit" className='mb-5 border-collapse border-2 w-96'>
                        Submit
                    </button>
                </form>
                <p className='text-red-500 font-bold w-[400px]'>
                    Please note that once you press submit button, you will be redirected to a new page. To come back, you will have to press 'Go back' button. Alternatively, you can also close the tab.
                </p>
            </div>
        </div>
    </>
  );
}