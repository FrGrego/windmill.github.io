function calcMu_mid(mu) {
    let mu_mid = 0;
    for (let j=0; j<mu.length; j++){
        mu_mid += mu[j];
    }
    return mu_mid/mu.length;
}
let cvn, ctx;
function draw(conture, k, color){
//            let cvn = this.$refs.canvas;
//            let ctx = cvn.getContext("2d");  
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(conture[0][0]*k*cvn.width+cvn.width*focusX, conture[0][1]*k*(-cvn.height)+cvn.height/2);
    for (let i = 1; i < conture.length; i++) {
        ctx.lineTo(conture[i][0]*k*cvn.width+cvn.width*focusX, conture[i][1]*k*(-cvn.height)+cvn.height/2);
    }
    ctx.closePath();
    ctx.stroke();
}
let airfoil_options = [];
//let airfoil_sel = 0;
var alphaR = new Vue({
  el: '#page',
  data: {
    eta: eta,
    xi: xi_max.toFixed(3),
    xii: xii[inx_opt].toFixed(3),
    e: e_arr[inx_opt],
    mu_mid: mu_mid,
    mu_mid_cur: 0,
    i_lop: i_lop,
    V: V,
    D: D,
    Z: Z,
    N: N,
    n: n,
    temper: "10 °C",
    airfoil_sel: 0,
    airfoil_opt: airfoil_options,
    airfoil_link: airfoils[0].link,
    r_R: r,
    or: [],
    zR: z,
    zuR: zu,
    aR: alpha,
    polaraR: set_polara,
    cyR: cy,
    muR: mu,
    ibCyR: ibCy,
    bR: b,
    bettaR: betta,
    phiR: phi,
    WR: W,
    ReR: Re,
  },
    methods: {
        calc: function(i, redrawing = true) {
//            console.log(i);
            let pol = set_polara[i];
            for (let j=0; j<polara[pol].a.length; j++){
                if (alpha[i] >= polara[pol].a[j] && alpha[i] < polara[pol].a[j]+0.25){ 
                    cy[i] = polara[pol].Cy[j];
                    mu[i] = polara[pol].Mu[j];
                    ibCy[i] = 4*Math.PI*r[i]*D*e_opt/((1+e_opt)*Math.pow(1-e_opt,2))/((zu[i]+mu[i])*Math.sqrt(1+Math.pow(zu[i],2)));
                    b[i] = Math.round(ibCy[i]/(i_lop*polara[pol].Cy[j])*1000);
                    betta[i] = roundPlus(radToDeg(Math.atan(1/zu[i])),1);
                    W[i] = roundPlus(V*(1-e_opt)*Math.sqrt(1+Math.pow(zu[i],2)),1);
                    Re[i] = Math.round(W[i]*b[i]/1000/KV[itm_kv]);
                    phi[i] = roundPlus(betta[i] - alpha[i], 1);
                    break;
                }   
            }
            this.mu_mid_cur = roundPlus(calcMu_mid(mu),4);
            if (redrawing) this.redraw();
        },
        calcW: function() {
//            console.log(V);
//            console.log(this.V);
            V = this.V;
            for (let j=0; j<r.length; j++){
                W[j] = roundPlus(V*(1-e_opt)*Math.sqrt(1+Math.pow(zu[j],2)),1);
                Re[j] = Math.round(W[j]*b[j]/1000/KV[itm_kv]);
            }
            this.N =  Math.round(0.481*Math.pow(D, 2)*Math.pow(V, 3)*xi_max);
            this.n = Math.round(30*Z*V/(Math.PI*(D/2)));
        },
        calcZ: function() {
            D = this.D;
            this.calcOr();
            Z = this.Z;
            
            inx_opt = calcXi_max(e_arr,Z,i_lop,mu_mid,r0);
            xi_max = xi[inx_opt];
            eta = roundPlus(xi_max/xii[inx_opt],2);
            this.eta = eta;
            this.xi = xi_max.toFixed(3);
            this.xii = xii[inx_opt].toFixed(3);
            this.e = e_arr[inx_opt];
            for (let j=0; j<r.length; j++){
                z[j] = roundPlus(Z*r[j],2);
                zu[j] = roundPlus(z[j]*(1+Math.sqrt(1+xii_opt/Math.pow(z[j],2)))/(2*(1-e_opt)),3);
                ibCy[j] = 4*Math.PI*r[j]*D*e_opt/((1+e_opt)*Math.pow(1-e_opt,2))/((zu[j]+mu[j])*Math.sqrt(1+Math.pow(zu[j],2)));
                b[j] = Math.round(ibCy[j]/(i_lop*cy[j])*1000);
                betta[j] = roundPlus(radToDeg(Math.atan(1/zu[j])),1);
                phi[j] = roundPlus(betta[j]-alpha[j],1);
            }
            this.calcW();
            this.redraw();
        },
        calcPol: function(i) {
//            console.log(this.polaraR);
            this.calc(i, true);
        },
        calcRe: function() {
            switch (this.temper){
                case '-10 °C': itm_kv = 0; break;
                case '0 °C': itm_kv = 1; break;
                case '10 °C': itm_kv = 2; break;
                case '20 °C': itm_kv = 3; break;
            }
            for (let j=0; j<r.length; j++){
                Re[j] = Math.round(W[j]*b[j]/1000/KV[itm_kv]);
            }
        },
        calcOr: function(i) {
            this.or = [ Math.round(r[0]*D/2*100),
                        Math.round(r[1]*D/2*100),
                        Math.round(r[2]*D/2*100),
                        Math.round(r[3]*D/2*100),
                        Math.round(r[4]*D/2*100)];
        },
        calcI: function(i) {
            i_lop = this.i_lop;
            this.calcZ();
        },
        update_mu: function(i) {
            mu_mid = this.mu_mid_cur;
            this.calcZ();
            this.mu_mid = this.mu_mid_cur;
        },
        calcAirfoil: function() {
            this.airfoil_link = airfoils[this.airfoil_sel].link;
            upd_polara(this.airfoil_sel);
            this.calc(0, false);
            this.calc(1, false);
            this.calc(2, false);
            this.calc(3, false);
            this.calc(4, true);
        },
        redraw: function(){
            cvn = this.$refs.canvas;
            if (cvn){
                ctx = cvn.getContext("2d");
                ctx.clearRect(0, 0, cvn.width, cvn.height);

                ctx.fillStyle = "red";    
                ctx.beginPath();
                ctx.arc(cvn.width*focusX, cvn.height/2, 2, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();

                draw(new_conture(airfoils[this.airfoil_sel].conture, phi[0]), b[0]/b[4],"Indigo");
                draw(new_conture(airfoils[this.airfoil_sel].conture, phi[1]), b[1]/b[4],"DarkOrange");
                draw(new_conture(airfoils[this.airfoil_sel].conture, phi[2]), b[2]/b[4],"Green");
                draw(new_conture(airfoils[this.airfoil_sel].conture, phi[3]), b[3]/b[4],"SaddleBrown");
                draw(new_conture(airfoils[this.airfoil_sel].conture, phi[4]), 1,"Blue");
            }
        },
    },
    created() {
        airfoils.forEach((airfoil,i)=>airfoil_options.push({ name: airfoil.name, value: i }));
        this.calc(0, false);
        this.calc(1, false);
        this.calc(2, false);
        this.calc(3, false);
        this.calc(4, false);
        this.calcOr();
    },
    mounted(){
        this.redraw();
    },
})