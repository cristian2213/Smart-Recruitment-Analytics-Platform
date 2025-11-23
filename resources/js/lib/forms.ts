// create a function to compare if the old values were modified, and return the modified values

// export function getChangedFields<T extends Record<string, any>>(
//   oldValues: T,
//   newValues: Partial<T>,
// ): Partial<T> {
//   const modifiedValues: Partial<T> = {}

//   for (const key in newValues) {
//     if (Object.prototype.hasOwnProperty.call(newValues, key)) {
//       if (
//         JSON.stringify(String(newValues[key])) !== JSON.stringify(String(oldValues[key]))
//       ) {
//         modifiedValues[key] = newValues[key]
//       }
//     }
//   }

//   return modifiedValues
// }
