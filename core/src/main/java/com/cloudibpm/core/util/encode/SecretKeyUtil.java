/**
 * 
 */
package com.cloudibpm.core.util.encode;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

/**
 * @author Caodahai
 *
 */
public class SecretKeyUtil {

	private final static SecretKeyUtil instance = new SecretKeyUtil();

	public static SecretKeyUtil getInstance() {
		return instance;
	}

	private SecretKeyUtil() {
	}

	public String createKey() {
		// We have five solutions:
		// 0. 3+7+6
		// 1. 5+7+4
		// 2. 7+5+4
		// 3. 3+5+8
		// 4. 7+3+6
		// a-z/0-9/A-Z

		Random random = ThreadLocalRandom.current();
		int s = random.nextInt(5); //
		final int[][] sol = new int[][] { { 3, 7, 6 }, { 5, 7, 4 }, { 7, 5, 4 }, { 3, 5, 8 }, { 7, 3, 6 } };

		int a = 0, b = 0, c = 0;
		char[] q = new char[16];
		int i = 0;
		List<Character> list1 = new ArrayList<Character>();
		while (i < 16) {
			int j = random.nextInt(3);
			if (a < sol[s][0] && j == 0) {
				q[i] = (char) nexta2z(random);
				list1.add(q[i]);
				a++;
				i++;
			}
			if (b < sol[s][1] && j == 1) {
				q[i] = (char) nextNum(random);
				list1.add(q[i]);
				b++;
				i++;
			}
			if (c < sol[s][2] && j == 2) {
				q[i] = (char) nextA2Z(random);
				list1.add(q[i]);
				c++;
				i++;
			}
		}
		// String s1 = new String(q);
		// System.out.println(s1);
		Collections.shuffle(list1);
		// System.out.println(list1.toString());
		Collections.shuffle(list1);
		// System.out.println(list1.toString());
		StringBuffer sb = new StringBuffer();
		for (int j = 0; j < list1.size(); j++) {
			sb.append(list1.get(j));
		}
		// System.out.println(sb.toString());
		return sb.toString();
	}

	private int nextNum(Random random) {
		return random.nextInt(10) + 48;
	}

	private int nexta2z(Random random) {
		return random.nextInt(26) + 97;
	}

	private static int nextA2Z(Random random) {
		return random.nextInt(26) + 65;
	}

	public boolean recognizeKey(String key) {
		int a = 0, b = 0, c = 0;
		// a-z/0-9/A-Z
		final int[][] sol = new int[][] { { 3, 7, 6 }, { 5, 7, 4 }, { 7, 5, 4 }, { 3, 5, 8 }, { 7, 3, 6 } };
		for (int i = 0; i < key.length(); i++) {
			// a-z
			if ((int) key.charAt(i) >= 97 && (int) key.charAt(i) <= 122) {
				a++;
			}
			// 0-9
			if ((int) key.charAt(i) >= 48 && (int) key.charAt(i) <= 57) {
				b++;
			}
			// A-Z
			if ((int) key.charAt(i) >= 65 && (int) key.charAt(i) <= 90) {
				c++;
			}
		}
		// System.out.println(a + ";" + b + ";" + c);
		for (int i = 0; i < sol.length; i++) {
			if (a == sol[i][0] && b == sol[i][1] && c == sol[i][2]) {
				return true;
			}
		}
		return false;
	}
}
