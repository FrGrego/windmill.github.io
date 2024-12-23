function roundPlus(x, n) { //x - число, n - количество знаков
  if(isNaN(x) || isNaN(n)) return false;
  var m = Math.pow(10,n);
  return Math.round(x*m)/m;
}
function radToDeg(rad) {
    return (rad * 180) / Math.PI;
}

let V = 3;      //m/c
let D = 4.6;    //m
let Z = 7.3;    //m
let R = 1;      //относительный радиус уонца лопасти
let r0 = 0.2;   //относительный радиус начала лопасти
//let Zmid = Z*(1+r0)/2; //средняя быстроходность
let mu_mid = 0.0199; //обратная характеристика лопасти
let i_lop = 3;      //шт

let e_arr = [];
let nv = 14;
//let nv = 1;
for (let j=0; j<nv; j++){
    e_arr[j]=roundPlus(0.3+0.2*j/(nv-1),3);
}
//e_arr[0]= 0.27;
//console.log(e_arr);
let xii = [];//КИЭВ идеальный
let xi = [];//КИЭВ расчётный
let Tj = [];//концевые потери
let Tp = [];//профильные потери
let Tm = [];//потери кручения струи

function calcXi_max(e_arr,Z,i,mu_mid,r0){
    let Zmid = Z*(1+r0)/2;
    let eta = [];
    let R = 1;
    let xi_max_tmp = 0;
    let j_opt = 0;

    for (let j=0; j<e_arr.length; j++){
        let e = e_arr[j];
        xii[j] = 4*e*(1-e)/(1+e);
        Tj[j] = e/(1-e)*(8*Math.sqrt(1+Math.pow((1-e)/Z,2))/((1+e)*i*Z)-1/Math.sqrt(1+Math.pow(i*Z/(Math.PI*(1-e/2)),2)));
        Tp[j] = 2*mu_mid*((1-e)/Z+Z/(3*(1-e)));
        eta[j] = (1-mu_mid*Zmid/(1-e))/(1+mu_mid*(1-e)/Zmid);
        Tm[j] = xii[j]*Math.pow(eta[j]/Z,2)/2*Math.log(R/r0);
        xi[j] = xii[j]*(1-Math.pow(r0/R,2)-Tj[j]-Tp[j]-Tm[j]);
        if (xi[j]>xi_max_tmp){
            j_opt = j;
            xi_max_tmp = xi[j];
        }
    }
//    console.log(j_opt, e_arr[j_opt]);
    return j_opt;
}
let inx_opt = calcXi_max(e_arr,Z,i_lop,mu_mid,r0);
let xi_max = xi[inx_opt];
let eta = roundPlus(xi_max/xii[inx_opt],2);
//console.log(xii,"- идеальный киэв");
//console.log(Tj,"- концевые потери");
//console.log(Tp,"- профильные потери");
//console.log(nu,"- КПД");
//console.log(Tm,"- потери кручения струи");
//console.log(xi,"- КИЭВ");

/*let ctx_T = document.getElementById('chartT').getContext('2d');
let ctx_xi = document.getElementById('chartXi').getContext('2d');
let chart_T = new Chart(ctx_T, {
    type: 'line',
 
    data: {
        labels: e_arr,
        datasets: [
        {
            label: 'концевые',
            backgroundColor: 'transparent',
            borderColor: 'red',
            data: Tj,
        },
        {
            label: 'профильные',
            backgroundColor: 'transparent',
            borderColor: 'blue',
            data: Tp,
        },
        {
            label: 'кручение струи',
            backgroundColor: 'transparent',
            borderColor: 'green',
            data: Tm,
        }],
    },
});
let chart_xi = new Chart(ctx_xi, {
    type: 'line',
 
    data: {
        labels: e_arr,
        datasets: [     
        { // График красного цвета
            label: 'идеальный КИЭВ',
            backgroundColor: 'transparent',
            borderColor: 'red',
            data: xii,
        },
        {
            label: 'КИЭВ',
            backgroundColor: 'transparent',
            borderColor: 'purple',
            data: xi,
        }],
    },
});

let ctx_Cy = document.getElementById('chartCy').getContext('2d');
let chart_Cy = new Chart(ctx_Cy, {
    type: 'line',
 
    data: {
        labels: polara[100000].a,
        datasets: [     
        { // График красного цвета
            label: 'Cy 100k',
            backgroundColor: 'transparent',
            borderColor: 'red',
            data: polara[100000].Cy,
        },
        {
            label: 'Cx 100k',
            backgroundColor: 'transparent',
            borderColor: 'green',
            data: polara[100000].Cx,
        },
        {
            label: 'μ 100k',
            backgroundColor: 'transparent',
            borderColor: 'blue',
            data: polara[100000].Mu,
        },
        {
            label: 'Cy 200k',
            backgroundColor: 'transparent',
            borderColor: 'yellow',
            data: polara[200000].Cy,
        }
        ],
    },
});
let ctx_mu = document.getElementById('chartMu').getContext('2d');
let chart_mu = new Chart(ctx_mu, {
    type: 'line',
 
    data: {
        labels: polara[100000].a,
        datasets: [
        {
            label: 'Cx 100k',
            backgroundColor: 'transparent',
            borderColor: 'green',
            data: polara[100000].Cx,
        },{
            label: 'μ 100k',
            backgroundColor: 'transparent',
            borderColor: 'blue',
            data: polara[100000].Mu,
        },{
            label: 'μ 200k',
            backgroundColor: 'transparent',
            borderColor: 'brown',
            data: polara[200000].Mu,
        }
        ],
    },
});*/

let xii_opt = xii[inx_opt];
let e_opt = e_arr[inx_opt];
//test
//xii_opt = 0.674;
//e_opt = 0.35;
//
//console.log(e_opt, xii_opt.toFixed(4), xi_max.toFixed(4));
let r = [1,0.8,0.6,0.4,0.2];
let mu = [];
let cy = [];
let set_polara = [200000,200000,200000,100000,100000];
let z = [];
let zu = [];
let ibCy = [];
let b = [];
let betta = [];
let alpha = [3,3.5,4,5.5,8];
let phi = [];
let W = [];

let KV = [1.2462E-5, 1.3324E-5, 1.4207E-5, 1.5111E-5]; //кинемат. вязкость поздуха при -10C 0C 10C 20C
let itm_kv = 2; //10C

let Re = [];
for (let j=0; j<r.length; j++){
    let pol = set_polara[j];
    z[j] = Z*r[j];
    zu[j] = roundPlus(z[j]*(1+Math.sqrt(1+xii_opt/Math.pow(z[j],2)))/(2*(1-e_opt)),3);
    
    for (let pj=0; pj<polara[pol].a.length; pj++){
        if (alpha[j] >= polara[pol].a[pj] && alpha[j] < polara[pol].a[pj]+0.25){ 
            cy[j] = polara[pol].Cy[pj];
            mu[j] = polara[pol].Mu[pj];
    
            ibCy[j] = 4*Math.PI*r[j]*D*e_opt/((1+e_opt)*Math.pow(1-e_opt,2))/((zu[j]+mu[j])*Math.sqrt(1+Math.pow(zu[j],2)));
            b[j] = Math.round(ibCy[j]/(i_lop*cy[j])*1000);
            betta[j] = roundPlus(radToDeg(Math.atan(1/zu[j])),1);
            phi[j] = roundPlus(betta[j]-alpha[j],1);

            W[j] = roundPlus(V*(1-e_opt)*Math.sqrt(1+Math.pow(zu[j],2)),1);
            Re[j] = Math.round(W[j]*b[j]/1000/KV[itm_kv]);
            break;
        }   
    }
}
//console.log(z,"- ");
//console.log(zu,"- число модулей");
//console.log(ibCy,"- ibCy");
//console.log(b,"- ширина лопасти");
//console.log(betta,"- градусов, угол бетта");
//console.log(W,"- скорость набегающего потока");
//console.log(Re,"- числа Рейнольдса");
//console.log("test");
               
let N =  Math.round(0.481*Math.pow(D, 2)*Math.pow(V, 3)*xi_max);
let n = Math.round(30*Z*V/(Math.PI*(D/2)));
