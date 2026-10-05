import React, {useEffect, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {main} from '../utilities/appState'
import Row from '../components/Row'
import HeaderImage from '../components/HeaderImage'
import malekith from '../images/malekith.png'
import Constants from '../Constants'

import Styles from './styles/Main.module.css'

const tg = window.Telegram?.WebApp

const Main = () => {
    const navigate = useNavigate()
    const user = tg?.initDataUnsafe?.user

    useEffect(() => {
        if (!main.userReq && user?.id) {
            main.userReq = true
            fetch(`https://aoscom.online/users/user_by_tg_id?tg_id=${user.id}`)
                .then(response => response.json())
                .then(data => {
                    if (data?.exists) {
                        main.user = data.user
                    }
                })
                .catch(error => console.error(error))
        }
    }, [user?.id])

    const handleSupport = useCallback(() => {
        if (tg) {
            tg.openLink('https://t.me/tribute/app?startapp=dRhg')
        } else {
            window.open('https://web.tribute.tg/d/Rhg', '_blank')
        }
    }, [])

    const handleNavigateToDeveloper = useCallback(() => {
        navigate(`/developer`)
    }, [navigate])

    return <>
        <HeaderImage src={malekith} alt='main' />
        <div id='column' className='Chapter'>
            <Row title='Battle Companion' navigateTo='battle-companion' />
            <Row title='Rules' navigateTo='mainRules' />
            <Row title='Builder' navigateTo='userLists' />
            <Row title='Community Lists' navigateTo='lists'/>
            <Row title='Spearhead' navigateTo='spearhead'/>
            <Row title='Damage Calculator' navigateTo='calculator' />
            {user?.id === Constants.myTgId ? <Row title='Developer Menu' navigateTo='developer' /> : null}
            <button id={Styles.suppotButton} onClick={handleSupport}>Support the app!</button>
            <p id={Styles.feedbackText}>For feedback - @RukosuevKrasavchik</p>
            <p id={Styles.feedbackText} onClick={handleNavigateToDeveloper}>The database was last updated on {Constants.lastUpdate}</p>
        </div>
    </>
}

export default Main