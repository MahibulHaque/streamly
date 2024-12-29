import { zodResolver } from '@hookform/resolvers/zod';
import { DefaultValues, useForm } from 'react-hook-form';
import z, { ZodSchema } from 'zod';

const useZodForm = <T extends z.ZodType<any>>(
	schema: ZodSchema,
	defaultValues?: DefaultValues<z.TypeOf<T>> | undefined,
) => {
	const {
		register,
		watch,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: { ...defaultValues },
	});

	return { register, watch, reset, handleSubmit, errors };
};
export default useZodForm;
