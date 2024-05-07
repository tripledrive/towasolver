window.onload = function(){
    //スタイルを読み込む
    for(i=0;i<style.length;i++){
        document.getElementById('style_1').insertAdjacentHTML('beforeend','<img src="'+style[i].src+'" class="ImageSelector__option" data-value="'+i+'">')
        document.getElementById('style_2').insertAdjacentHTML('beforeend','<img src="'+style[i].src+'" class="ImageSelector__option" data-value="'+i+'">')
    }
    const el_demo1 = document.getElementById('style_1');
    const image_selector1 = new ImageSelector(el_demo1);
    const el_demo2 = document.getElementById('style_2');
    const image_selector2 = new ImageSelector(el_demo2);

    //武器を読み込む
    for(i=0;i<weapon.length;i++){
        document.getElementById('main_1_s').insertAdjacentHTML('beforeend',"<option value='"+i+"'>"+weapon[i].name+"</option>")
        document.getElementById('sub_1_s').insertAdjacentHTML('beforeend',"<option value='"+i+"'>"+weapon[i].name+"</option>")
        document.getElementById('main_2_s').insertAdjacentHTML('beforeend',"<option value='"+i+"'>"+weapon[i].name+"</option>")
        document.getElementById('sub_2_s').insertAdjacentHTML('beforeend',"<option value='"+i+"'>"+weapon[i].name+"</option>")
    }

    //装飾品を読み込む
    for(i=0;i<acce.length;i++){
        document.getElementById('acc_1_s').insertAdjacentHTML('beforeend',"<option value='"+i+"'>"+acce[i].name+"</option>")
        document.getElementById('acc_2_s').insertAdjacentHTML('beforeend',"<option value='"+i+"'>"+acce[i].name+"</option>")
    }

    //柱を読み込む
    for(i=0;i<summoner.length;i++){
        document.getElementById('summoner_1_s').insertAdjacentHTML('beforeend',"<option value='"+i+"'>"+summoner[i].name+"</option>")
        //document.getElementById('summoner_2_s').insertAdjacentHTML('beforeend',"<option value='"+i+"'>"+summoner[i].name+"</option>")
    }
}

function towasolve(){
    document.getElementById('output').innerHTML = ''
    document.getElementById('movepoints').innerHTML = ''

    const style_1 = style[document.getElementsByClassName("ImageSelector__preview-child")[0].getAttribute('data-value')]
    const style_2 = style[document.getElementsByClassName("ImageSelector__preview-child")[1].getAttribute('data-value')]
    const weapon_main_1 = weapon[document.getElementById('main_1_s').value]
    const weapon_main_2 = weapon[document.getElementById('main_2_s').value]
    const weapon_sub_1 = weapon[document.getElementById('sub_1_s').value]
    const weapon_sub_2 = weapon[document.getElementById('sub_2_s').value]
    const acc_1 = acce[document.getElementById('acc_1_s').value]
    const acc_2 = acce[document.getElementById('acc_2_s').value]
    const stats_1 = document.getElementById('stats_val_1').value
    const stats_2 = document.getElementById('stats_val_2').value
    const stats_memory = document.getElementById('memorial_val').value
    const summoner_1 = summoner[document.getElementById('summoner_1_s').value]
    //const summoner_2 = summoner[document.getElementById('summoner_2_s').value]

    //基礎素早さの計算
    let spd1 = Number(style_1.spd) + Number(stats_1) + Number(stats_memory)
    let spd2 = Number(style_2.spd) + Number(stats_2) + Number(stats_memory)
    
    //スタイルパッシブの計算
    let pas1 = 0
    let pas2 = 0
    if(style_1.passive != ''){
        if(style_1.pair == style_2.name){
            pas1 = (spd1 * ((Number(style_1.passive) + Number(style_1.bonus))/100))
        }else{
            pas1 = (spd1 * (Number(style_1.passive)/100)) 
        }
    }
    if(style_2.passive != ''){
        if(style_1.pair == style_2.name){
            pas2 = (spd2 * ((Number(style_2.passive) + Number(style_2.bonus))/100))
        }else{
            pas2 = (spd2 * (Number(style_2.passive)/100)) 
        }
    }

    //武器パッシブの計算
    let mt1 = document.getElementById('main_1_t').value
    let mt2 = document.getElementById('main_2_t').value
    let st1 = document.getElementById('sub_1_t').value
    let st2 = document.getElementById('sub_2_t').value
    let main1 = weapon_passive(weapon_main_1,style_1,mt1,spd1)
    let main2 = weapon_passive(weapon_main_2,style_2,mt2,spd2)
    let sub1 = weapon_passive(weapon_sub_1,style_1,st1,spd1)
    let sub2 = weapon_passive(weapon_sub_2,style_2,st2,spd2)
    
    //装飾品パッシブの計算
    let at1 = document.getElementById('acc_1_t').value
    let at2 = document.getElementById('acc_2_t').value
    let acc1 = acce_passive(acc_1,at1,spd1)
    let acc2 = acce_passive(acc_2,at2,spd2)

    //召喚柱パッシブの計算
    let ct1 = document.getElementById('summoner_1_t').value
    let ct2 = document.getElementById('summoner_1_t').value
    let smm1 = summ_passive(summoner_1,ct1,spd1)
    let smm2 = summ_passive(summoner_1,ct2,spd2)

    console.log(spd1+pas1+main1+sub1+acc1+smm1);
    console.log(spd2+pas2+main2+sub2+acc2+smm2);

    document.getElementById('output').insertAdjacentHTML('beforeend','計算結果 => ' +Math.ceil(Number(spd1+pas1+main1+sub1+acc1+smm1+spd2+pas2+main2+sub2+acc2+smm2))+ '('+style_1.name+':'+Math.ceil(Number(spd1+pas1+main1+sub1+acc1+smm1))+','+style_2.name+':'+Math.ceil(Number(spd2+pas2+main2+sub2+acc2+smm2))+')')

    //行動取得ポイントの算出
    let spp = Number(spd1+pas1+main1+sub1+acc1+smm1+spd2+pas2+main2+sub2+acc2+smm2)
    const cspp = spp + 1
    let calc_spp = 120 - Math.floor(cspp/20)


    document.getElementById('movepoints').insertAdjacentHTML('beforeend','行動取得 => '+calc_spp)
    document.getElementById('save').classList.remove('enable')
    document.getElementById('save').classList.add('able')
}

function summ_passive(summ,at,spd){
    if(at == 0){
        return (spd * ((Number(summ.t0))/100))
    }else if(at == 1){
        return (spd * ((Number(summ.t1))/100))
    }else if(at == 2){
        return (spd * ((Number(summ.t2))/100))
    }else if(at == 3){
        return (spd * ((Number(summ.t3))/100))
    }else if(at == 4){
        return (spd * ((Number(summ.t4))/100))
    }
}


function acce_passive(acce,at,spd){
    if(at == 0){
        return (spd * ((Number(acce.t0))/100))
    }else if(at == 1){
        return (spd * ((Number(acce.t1))/100))
    }else if(at == 2){
        return (spd * ((Number(acce.t2))/100))
    }else if(at == 3){
        return (spd * ((Number(acce.t3))/100))
    }else if(at == 4){
        return (spd * ((Number(acce.t4))/100))
    }
}

function weapon_passive(weapon,style,mt,spd){
    if(mt == 0){
        if(weapon.style == style.name){
            return (spd * ((Number(weapon.t0) + Number(weapon.bonus))/100))
        }else{
            return (spd * ((Number(weapon.t0))/100))
        }
    }else if(mt == 1){
        if(weapon.style == style.name){
            return (spd * ((Number(weapon.t1) + Number(weapon.bonus))/100))
        }else{
            return (spd * ((Number(weapon.t1))/100))
        }
    }else if(mt == 2){
        if(weapon.style == style.name){
            return (spd * ((Number(weapon.t2) + Number(weapon.bonus))/100))
        }else{
            return (spd * ((Number(weapon.t2))/100))
        }
    }else if(mt == 3){
        if(weapon.style == style.name){
            return (spd * ((Number(weapon.t3) + Number(weapon.bonus))/100))
        }else{
            return (spd * ((Number(weapon.t3))/100))
        }
    }else if(mt == 4){
        if(weapon.style == style.name){
            return (spd * ((Number(weapon.t4) + Number(weapon.bonus))/100))
        }else{
            return (spd * ((Number(weapon.t4))/100))
        }
    }

}
