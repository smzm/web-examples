'use client';

import Button from '@/app/components/AtomicUI/Button';
import { InputField } from '@/app/components/AtomicUI/InputField';
import { messageSchema, TMessageSchema } from '@/app/types/message';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { startTransition } from 'react';
import { useForm } from 'react-hook-form';
import submitMessage from '../../actions/submitMessage';

export default function ChatInput() {
  const path = usePathname();
  const receiver = path?.split('/')[1];
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<TMessageSchema>({
    resolver: zodResolver(messageSchema),
  });

  function onSendMessage(Message: TMessageSchema) {
    if (!receiver) return null;
    startTransition(() => {
      submitMessage({ Message, receiverUsername: receiver }).then((res) => {
        if (res.success) {
          reset();
        }
      });
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSendMessage)}
      className="flex w-full items-baseline justify-center"
    >
      <InputField
        placeholder="Message"
        register={register}
        errors={errors}
        name="content"
        className="mx-4"
      />
      <Button variant="secondary" size="medium">
        Send
      </Button>
    </form>
  );
}
