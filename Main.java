public class Main {
  public static void main(String[] args) {
    System.out.println(esPalindromo("reconocer")); // Debería mostrar true
    System.out.println(esPalindromo("hola")); // Debería mostrar false
  }

  public static boolean esPalindromo(String str) {
    return str.equals(new StringBuilder(str).reverse().toString());
  }
}