// hijri.js: Hijri Date calculator (ver 1.1)
// Modified by: Mohammed Hawa

// This is a simplified version of the open-source Hijri Date calculator 
// posted on this site:
// http://www.al-habib.info/islamic-calendar/hijricalendartext.htm
// Here is the description found next to the source:
// The script (modified from Robert van Gent's page) calculates approximate 
// hijri dates from current computer's date. It is based on arithmetical 
// calculation to match the current moon phase. The calculation is based 
// on 30-year lunar cycle where length of the lunar months is defined aternatingly 
// as 29 or 30 days. Every two or three year an extra day is added at the end of 
// the year to keep up with the phase of the moon. This formula is also similar 
// to "Kuwaiti Algorithm" used by Microsoft to define Hijri Calendar dates.

function ConvertToHijriDate(now)
{
	var d, m, y;
	var a, b, jd, bb, cc, dd, ee;
	var iyear, jd, cyc, z, j;
	var id, im, iy;
/*	
	if(adjust) {
		adjustmili = 1000*60*60*24*adjust; 
		todaymili = today.getTime()+adjustmili;
		today = new Date(todaymili);
	}
*/
/*
	var now = new Date();
	var adjustedDate = new Date(now.getYear(), now.getMonth(), now.getDate()+parseInt(System.Gadget.Settings.readString("HijriAdjustment")),now.getHours(),now.getMinutes(),now.getSeconds(),0);
	var d=adjustedDate.getDate(); // day
	var m=adjustedDate.getMonth(); // month
	var y=adjustedDate.getYear(); // year

	return {date : d, month : m, year: y};	
*/
	d = now.getDate();
	m = now.getMonth()+1;
	y = now.getFullYear();
	
	if(m<3) {
		y -= 1;
		m += 12;
	}

	a = Math.floor(y/100.);
	b = 2-a+Math.floor(a/4.);
	if(y<1583) 
		b = 0;
	if(y==1582) {
		if(m>10)  
			b = -10;
		if(m==10) {
			b = 0;
			if(d>4) 
				b = -10;
		}
	}

	jd = Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+b-1524; // julian day number

	b = 0;
	if(jd>2299160){
		a = Math.floor((jd-1867216.25)/36524.25);
		b = 1+a-Math.floor(a/4.);
	}
	bb = jd+b+1524;
	cc = Math.floor((bb-122.1)/365.25);
	dd = Math.floor(365.25*cc);
	ee = Math.floor((bb-dd)/30.6001);
	if(ee>13) {
		cc += 1;
	}
	
	iyear = 10631./30.;
	
	z = jd-1948084; // epochastro (epochcivil = 1948085)
	cyc = Math.floor(z/10631.);
	z = z-10631*cyc;
	j = Math.floor((z - 8.01/60.)/iyear);
	iy = 30*cyc+j;
	z = z-Math.floor(j*iyear + 8.01/60.);
	im = Math.floor((z+28.5001)/29.5);
	if(im==13) im = 12;
	id = z-Math.floor(29.5001*im-29);

	var myRes = new Array(3);

	myRes[0] = id; //islamic date
	myRes[1] = im-1; //islamic month
	myRes[2] = iy; //islamic year
	
	return myRes;	
	
}

