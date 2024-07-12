import React, {useEffect, useRef} from 'react';
import styles from './SignUpForm.module.scss'

const VerificationInput = () => {

    const input = useRef();
    useEffect(() => {
        input.current.focus();
    }, []);

    return (
        <>
            <p>Step 2: 이메일로 전송된 인증번호 4자리를 입력해주세요.</p>
            <div className={styles.codeInputContainer}>
                <input
                    type='text'
                    ref={input}
                />
            </div>
        </>
    );
};

export default VerificationInput;