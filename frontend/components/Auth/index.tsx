import styles from './Auth.module.scss'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Button,
    Input,
    Text,
    useToast,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { setIsAuthenticated, setToggleModalLogin, setTokenAccess, setUser } from '../../redux/reducers/authReducer'
import { useState } from 'react'
import { api } from '../../utils/api'
import { AxiosError } from 'axios'
import { ApiError } from '../../types/Api'
import { ApiDoLogin, ApiDoRegister } from '../../types/Auth'
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router'

export default () => {
    const auth = useSelector((state: RootState) => state.auth)

    const router = useRouter()
    const toast = useToast()
    const dispatch = useDispatch()

    const [typeAuth, setTypeAuth] = useState<'login' | 'register'>('login')
    const [inputName, setInputName] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [inputPassword, setInputPassword] = useState('')

    const onClose = () => {
        dispatch(setToggleModalLogin(false))
        setInputName('')
        setInputEmail('')
        setInputPassword('')
    }

    const handleLogin = async () => {
        try {
            const login: ApiDoLogin = await api('auth/login', 'post', {
                email: inputEmail,
                password: inputPassword
            })

            dispatch(setUser(login.user))
            dispatch(setTokenAccess(login.access))
            dispatch(setIsAuthenticated(true))

            setCookie('access', login.access)

            toast({
                status: 'success',
                title: 'Obrigado! Você se autenticou com sucesso!',
                duration: 6000,
                isClosable: true,
                position: 'bottom-left'
            })

            onClose()
        } catch (error) {
            const e = error as AxiosError<ApiError>

            toast({
                status: 'error',
                title: e.response?.data.detail,
                duration: 9000,
                position: 'bottom-left'
            })
        }
    }

    const handleRegister = async () => {
        try {
            const register: ApiDoRegister = await api('auth/register', 'post', {
                name: inputName,
                email: inputEmail,
                password: inputPassword
            })

            dispatch(setUser(register.user))
            dispatch(setTokenAccess(register.access))
            dispatch(setIsAuthenticated(true))

            setCookie('access', register.access)

            toast({
                status: 'success',
                title: 'Obrigado! Você se autenticou com sucesso!',
                duration: 6000,
                isClosable: true,
                position: 'bottom-left'
            })

            onClose()
        } catch (error) {
            const e = error as AxiosError<ApiError>

            toast({
                status: 'error',
                title: e.response?.data.detail,
                duration: 9000,
                position: 'bottom-left'
            })
        }
    }

    return (
        <div>
            <Modal isOpen={auth.modal_login} onClose={() => null} >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Autenticar-se</ModalHeader>

                    <hr />

                    <ModalBody>
                        {typeAuth == 'register' &&
                            <div className={'mb-3'}>
                                <Text fontWeight={600} className='mb-1'>Nome</Text>
                                <Input
                                    type='email'
                                    placeholder='Digite seu nome'
                                    value={inputName}
                                    onChange={e => setInputName(e.target.value)}
                                />
                            </div>
                        }

                        <div className={styles.inputItem}>
                            <Text fontWeight={600} className='mb-1'>Email</Text>
                            <Input
                                type='email'
                                placeholder='Digite seu email'
                                value={inputEmail}
                                onChange={e => setInputEmail(e.target.value)}
                            />
                        </div>

                        <div className={'mt-3'}>
                            <Text fontWeight={600} className='mb-1'>Senha</Text>
                            <Input
                                type='password'
                                placeholder='Digite sua senha'
                                value={inputPassword}
                                onChange={e => setInputPassword(e.target.value)}
                            />
                        </div>
                    </ModalBody>

                    <div className='d-flex justify-content-center mt-2'>
                        {typeAuth == 'register' ?
                            <Text className='mb-1'>
                                Já tem conta?
                                <span
                                    onClick={() => setTypeAuth('login')}
                                    style={{ color: 'blue', cursor: 'pointer' }}
                                > Login</span>
                            </Text>
                            :
                            <Text className='mb-1'>
                                Ainda não tem conta?
                                <span
                                    onClick={() => setTypeAuth('register')}
                                    style={{ color: 'blue', cursor: 'pointer' }}
                                > Registrar-se</span>
                            </Text>
                        }
                    </div>

                    <hr className='mt-2' />

                    <ModalFooter>
                        <Button variant='ghost' onClick={onClose} style={{ marginRight: '10px' }}>Fechar</Button>

                        {typeAuth == 'login' ?
                            <Button colorScheme='blue' mr={3} onClick={handleLogin} >
                                Entrar
                            </Button>
                            :
                            <Button colorScheme='blue' mr={3} onClick={handleRegister} >
                                Cadastrar
                            </Button>
                        }
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}