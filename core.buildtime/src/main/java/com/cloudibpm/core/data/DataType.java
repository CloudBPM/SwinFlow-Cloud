/**
 * This interface represents all data variable data type on Cloud iBPM
 * @user Dahai CAO
 * @date 22/06/2011 10:00:29 AM and last updated on 2017-10-04
 */
package com.cloudibpm.core.data;

public interface DataType extends java.io.Serializable {
	/**
	 * Basic data variable type. Integer type.
	 */
	public final String INTEGER = "Integer"; // $NON-NLS-1$
	/**
	 * Basic data variable type. Double type.
	 */
	public final String DOUBLE = "Double"; // $NON-NLS-1$
	/**
	 * Basic data variable type. Boolean type.
	 */
	public final String BOOLEAN = "Boolean"; // $NON-NLS-1$
	/**
	 * Basic data variable type. String type.
	 */
	public final String STRING = "String"; // $NON-NLS-1$
	/**
	 * Advanced data variable type. File type. This type can be treated as any
	 * file type. The another property can represent the concentrate file type.
	 * Cloud iBPM supported this type from 2017-10-04.
	 */
	public final String FILE = "File"; // $NON-NLS-1$
	/**
	 * Advanced data variable type. Date type, the format is YYYY-MM-DD. Cloud
	 * iBPM supported this type from 2017-10-04.
	 */
	public final String DATE = "Date"; // $NON-NLS-1$
	/**
	 * Advanced data variable type. Time type, the format is HH:mm:ss, e.g.,
	 * 23:59:59. Cloud iBPM supported this type from 2017-10-04.
	 */
	public final String TIME = "Time"; // $NON-NLS-1$
	/**
	 * Advanced data variable type. Currency type. Cloud iBPM supported this
	 * type from 2017-10-04.
	 */
	public final String CURRENCY = "Currency"; // $NON-NLS-1$
	/**
	 * Advanced data variable type. Date time type.This type represents a date
	 * and time, e.g, 2017-10-04 11:32am. Cloud iBPM supported this type from
	 * 2017-10-04.
	 */
	public final String DATETIME = "DateTime"; // $NON-NLS-1$
	/**
	 * Advanced data variable type. Time duration type. This type represents a
	 * continuous time duration (e.g., one day, two days, three minutes, four
	 * hours, two years, six months, etc.). Cloud iBPM supported this type from
	 * 2017-10-04.
	 */
	public final String TIMEDURATION = "TimeDuration"; // $NON-NLS-1$
	/**
	 * Advanced data variable type. This type represents JSON data which can be
	 * parsed by JAVA JSON parser. Cloud iBPM supported this type from
	 * 2017-10-04.
	 */
	public final String JSON = "JSONData"; // $NON-NLS-1$
	/**
	 * Advanced data variable type. This type represents hand writing data such
	 * as signature, which is made by person. Cloud iBPM supported this type
	 * from 2017-10-04.
	 */
	public final String HANDWRITING = "Handwriting"; // $NON-NLS-1$
}
