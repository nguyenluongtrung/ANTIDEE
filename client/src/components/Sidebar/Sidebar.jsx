import React from 'react';
import home from '../../assets/img/home.png';
import person from '../../assets/img/person.png';
import user from '../../assets/img/user.png';
import money from '../../assets/img/money.png';
import gift from '../../assets/img/Gift.png';
import infor from '../../assets/img/Informa.png';
import task from '../../assets/img/task.png';
import map from '../../assets/img/map.png';
import setting from '../../assets/img/setting.png';
import sun from '../../assets/img/sun.png';

export const Sidebar = () => {
    return (
<div className='justify-center p-7'>
<img className="py-4 px-1" src={home} />
<img className="py-4 px-1.5" src={person} />
<img className="py-4 px-1" src={user} />
<img className="py-4 px-1" src={money} />
<img className="py-4 " src={gift} />
<img className="py-4 px-1" src={infor} />
<img className="py-4 px-1" src={task} />
<img className="py-4 px-1" src={map} />
<img className="py-4 px-1" src={setting} />
<img className="py-4 px-0.5" src={sun} />
</div>
    );
}