import * as Yup from 'yup'
import { ValidationError } from 'yup'

import { PasswordTypes, StoredPassword, ValidationResultProps } from './types'

const loginPasswordSchema = Yup.object({
	title: Yup.string().required('Especifique o nome do serviço.'),
	username: Yup.string().required('Especifique o nome de usuário ou e-mail.'),
	password: Yup.string().required('Especifique a senha.')
})

const passwordOnlySchema = Yup.object({
	title: Yup.string().required('Especifique o nome do serviço.'),
	password: Yup.string().required('Especifique a senha.')
})

const SSHSchema = Yup.object({
	title: Yup.string().required('Especifique o nome do serviço.'),
	username: Yup.string().required('Especifique o nome de usuário ou e-mail.'),
	password: Yup.string().required('Especifique a senha.'),
	port: Yup.string().required('Especifique a porta.'),
	link: Yup.string().required('Especifique o domínio ou IP.')
})

const FTPSchema = Yup.object({
	title: Yup.string().required('Especifique o nome do serviço.'),
	username: Yup.string().required('Especifique o nome de usuário ou e-mail.'),
	password: Yup.string().required('Especifique a senha.'),
	port: Yup.string().required('Especifique a porta.'),
	link: Yup.string().required('Especifique o domínio ou IP.')
})

export async function validate(data: StoredPassword): Promise<ValidationResultProps> {
	switch(data.type) {
		case PasswordTypes.LOGIN_PASSWORD:
			try {
				await loginPasswordSchema.validate(data)
			} catch(e) {
				return {
					success: false,
					error: (e as ValidationError).errors[0]
				}
			}

			return { success: true }
		
		case PasswordTypes.PASSWORD_ONLY:
			try {
				await passwordOnlySchema.validate(data)
			} catch(e) {
				return {
					success: false,
					error: (e as ValidationError).errors[0]
				}
			}

			return { success: true }

		case PasswordTypes.SSH:
			try {
				await SSHSchema.validate(data)
			} catch(e) {
				return {
					success: false,
					error: (e as ValidationError).errors[0]
				}
			}

			return { success: true }

		case PasswordTypes.FTP:
			try {
				await FTPSchema.validate(data)
			} catch(e) {
				return {
					success: false,
					error: (e as ValidationError).errors[0]
				}
			}

			return { success: true }

		default:
			return {
				success: true
			}
	}
}

