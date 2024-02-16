import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit"; 
 
const initialValues = [
    {
        total: 0,
        lost: 0,
        afterLost: 0,
        details:[],
        loading: false,
    }
];

const addjustAfterLost = ( state ) =>{
  const tmpState = [...current(state)];
  const uStateLength = tmpState.length - 1;
  for( let i = 0; i <= uStateLength; i++){
      let currTmp = {...tmpState[i]};
      
      const lost = currTmp.lost;
      const ta = currTmp.details?.reduce( (ac, v) => ac += Number(v.amount), 0);
      const al = ta * (1-(lost/100));
      currTmp.total = ta;
      currTmp.afterLost = al;
       
      // if( !!tmpState[i + 1] ){
      //   let nextTmp = {...tmpState[i + 1]};
      //   nextTmp = {
      //     ...nextTmp,
      //     details : nextTmp.details?.map( (m, i) => {
      //       return { ...m, amount: i === 0 ? al : m.amount }
      //     }) || []
      //   } 
      //   tmpState[i + 1] = {...nextTmp};
      // }

      tmpState[i - 0] = {...currTmp};
  }

  return tmpState;
} 

const addjustPercent = ( state ) => {
  const tmpState = [...state];
  const uStateLength = tmpState.length - 1; 
 
  for( let i = 0; i <= uStateLength; i++){ 
      let currTmp = {...tmpState[i]};  
      const cd = [...currTmp.details]; 

      currTmp = {
        ...currTmp,
        details: cd.map( ( m, ind ) => {
            const percent = ((m.amount / currTmp?.total) || 0); 
            return ({ ...m, percent: percent })
        })
      }  

      tmpState[i - 0] = {...currTmp}; 
  } 
  return tmpState; 
}

const addjustPercentTotal = ( state ) =>{
  const tmpState = state;
  const uStateLength = tmpState.length - 1;
 
  for( let i = 0; i <= uStateLength; i++){ 
      let currTmp = {...tmpState[i]};  
      const cd = [...currTmp.details]; 

      currTmp = {
        ...currTmp,
        details: cd.map( ( m, ind ) => { 
          const nextPercent = (!!tmpState[i+1] ? tmpState[i+1].details[0]?.percent || 1 : m.percent);
          const total_percent = (() => {
            if( i === uStateLength && ind === 0 && i > 0 ) return null;
            else if( i === uStateLength ) return Number(m?.percent || 0);
            else return Number(m?.percent || 0) * nextPercent;
          })();
 
          return { ...m, totalpercent: total_percent };
        })
      } 
      tmpState[i - 0] = {...currTmp}; 
  }
  
  return tmpState;
}

export const setValueAsync = createAsyncThunk(
  "sample-request-data/setValueAsync",
  async ( value ) => {
    const job = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (value >= 0) {
          resolve(value);
        } else {
          reject(Error(""));
        }
      }, 1000);
    });

    return await job;
  }
);

const samplePreparationSlice = createSlice({
  name: "sample-preparation-data",
  initialState: initialValues,
  reducers: {
    reset: () => initialValues,
    added: (state, action) => {
      const lastStep = state[state.length - 1];
      state.push(
        {
          total: lastStep.total,
          lost: 0,
          afterLost: lastStep.afterLost * (1-(0/100)),
          details:[
            { 
              id:"1",
              stcode: "",
              stname: `paste from step ${state.length}`, 
              amount: Number( lastStep.afterLost.toFixed(2) ),
              percent:(lastStep.total / lastStep.total || 0),
              stepno: state.length + 1
            }            
          ],
          loading: false,
        }
      ); 
      let jus__01 = addjustAfterLost(state);  
      let jus__02 = addjustPercent(jus__01);
      let jus__03 = addjustPercentTotal(jus__02);

      jus__03.forEach( (element, ind) => {
          state[ind].total = element.total;
          state[ind].lost = element.lost;
          state[ind].afterLost = element.afterLost;
          state[ind].loading = element.loading;

          state[ind].details = [...element.details];
      });
    },
    deleted:(state, action) => {
      const { index } = action.payload;

      state.splice( index, 1);
      let jus__01 = addjustAfterLost(state);  
      let jus__02 = addjustPercent(jus__01);
      let jus__03 = addjustPercentTotal(jus__02);

      jus__03.forEach( (element, ind) => {
          state[ind].total = element.total;
          state[ind].lost = element.lost;
          state[ind].afterLost = element.afterLost;
          state[ind].loading = element.loading;

          state[ind].details = [...element.details];
      });
    },
    updateDetailWithIndex:(state, action) => {
      const { index, detail } = action.payload;

      state[index].details = [...detail]; 
    },    
    addItemsDetail: (state, action) => { 
        const {index, detail, lost} = action.payload;
        
        const total_amount = detail.reduce( (acc, val) => acc += Number(val.amount) , 0); 
        const tmp = detail.map( elm => { 
            // console.log(elm);
            //elm.id = ind++
            return {
                ...elm,
                percent: (Number(elm.amount) / total_amount || 0) * 100,
                stepno: index + 1,
            }
        });  
 
        //detail = [...tmp];
        //const afterLost = total_amount * (1-(lost/100)); 
 
        state[index].details = [...tmp];  
        state[index].total = total_amount;
        state[index].lost = Number(lost);
        // state[index].afterLost = afterLost;
 
        let jus__01 = addjustAfterLost(state);  
        let jus__02 = addjustPercent(jus__01);
        let jus__03 = addjustPercentTotal(jus__02);
        
        jus__03.forEach( (element, ind) => {
            state[ind].total = element.total;
            state[ind].lost = element.lost;
            state[ind].afterLost = element.afterLost;
            state[ind].loading = element.loading;
  
            state[ind].details = [...element.details];
        });
    },
    setValue: (state, action) => {
      const { detail } = action.payload;

      const step = [...new Set(detail?.map( m => m.stepno))];
      let value = []; 
      for( let s of step){
        const v = detail.filter( f => f.stepno === s ); 
        if( v.length > 0 ){
          value.push(
            {
              total: Number(v[0].amount_total || 0),
              lost: Number(v[0].lost || 0),
              afterLost: Number(v[0].amount_after_lost || 0),
              details:v.map( (m, i) => (
                { 
                  id: (i+1),
                  stcode: m.stcode,
                  stname: !m.stname ? `paste from step ${i}` : m.stname, 
                  amount: Number(m.amount || 0),
                  percent: Number(m.percent || 0),
                  totalpercent: Number(m.totalpercent || 0),
                  stepno: m.stepno,
                  method: m.method,
                } 
              )), 
              loading: false,
            }
          ); 
        } 
      }
      
      return value;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(setValueAsync.fulfilled, (state, action) => {
      state.counter = action.payload;
      state.loading = false;
    });

    builder.addCase(setValueAsync.rejected, (state, action) => {
      state.counter = 0;
      state.loading = false;
    });

    builder.addCase(setValueAsync.pending, (state, action) => {
      state.loading = true;
    });
  },
});

export const { addItemsDetail, updateDetailWithIndex, reset, added, deleted, setValue} = samplePreparationSlice.actions;
export const samplePreparationSelector = (store) => store.samplePreparationSlice;
export default samplePreparationSlice.reducer;