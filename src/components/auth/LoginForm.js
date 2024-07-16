import React from 'react';
import {Form, Link, redirect, useActionData} from 'react-router-dom';  // Link 컴포넌트 추가
import styles from './LoginForm.module.scss';
import { AUTH_URL } from "../../config/host-config";

const LoginForm = () => {

    const errorText = useActionData();

    return (
        <>
            <Form method="post" className={styles.form}>
                <h1>Log in</h1>
                <p>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" name="email" required/>
                </p>
                <p>
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" name="password" required/>
                </p>
                <div className={styles.actions}>
                    <button type="submit" className={styles.loginButton}>Login</button>
                </div>

                {errorText && <p className={styles.error}>{errorText}</p>}

                <div className={styles.registerLink}>
                    <Link to="/sign-up">회원이 아니십니까? 회원가입을 해보세요</Link>
                </div>
            </Form>
        </>
    );
}

export default LoginForm;

// login form에 대한 트리거 함수. (form태그 대신 action함수 버전. Form태그)
// route-config에서 LoginForm 컴포넌트의 직속 부모에다 등록
// 파라미터로 온갖 정보들이 들어있고, 거기서 request만 디스트럭쳐링.
export const loginAction = async ({ request }) => {

    // 입력데이터 읽기
    const formData = await request.formData();

    const payload = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    const response = await fetch(`${AUTH_URL}/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(payload)
    })


    // 실패한 경우 (status코드가 422번.)
    if (response.status === 422) {
        const errorText = await response.text();

        // 액션함수가 리턴한 데이터를 컴포넌트에서 쓰는법
        // 컴포넌트에서 useActionData 훅을 사용
        return errorText
    }

    // 성공한 경우
    const responseData = await response.json();
    console.log(responseData)

    // 브라우저 저장소
    // localStorage: 창 꺼도 안없어짐
    // sessionStorage: 창 끄면 없어짐
    // JSON으로 파싱을 안하면 [object, Object]로 출력되니, 파싱해서 저장.
    localStorage.setItem('userData', JSON.stringify(responseData))

    return redirect('/')
}

